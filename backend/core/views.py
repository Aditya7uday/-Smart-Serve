from django.contrib.auth import get_user_model
from django.db.models import F, Sum
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Category, InventoryItem, MenuItem, Order, Review
from .permissions import IsAdminOrReadOnly, IsAdminRole
from .serializers import (
    CategorySerializer, InventoryItemSerializer, MenuItemSerializer,
    OrderSerializer, RegisterSerializer, ReviewSerializer, UserSerializer,
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not User.objects.filter(email=email).exists():
            return Response({'detail': 'No account found with this email'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'message': 'Password reset instructions sent to your email.'})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class MenuItemViewSet(viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = MenuItem.objects.all()
        params = self.request.query_params
        if params.get('categoryId'):
            qs = qs.filter(category_id=params['categoryId'])
        if params.get('search'):
            qs = qs.filter(name__icontains=params['search'])
        if params.get('isVeg') == 'true':
            qs = qs.filter(is_veg=True)
        sort_by = params.get('sortBy')
        if sort_by == 'price_asc':
            qs = qs.order_by('price')
        elif sort_by == 'price_desc':
            qs = qs.order_by('-price')
        elif sort_by == 'rating':
            qs = qs.order_by('-rating')
        return qs

    @action(detail=True, methods=['patch'])
    def toggle_availability(self, request, pk=None):
        item = self.get_object()
        item.available = not item.available
        item.save(update_fields=['available'])
        return Response(self.get_serializer(item).data)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        qs = Review.objects.filter(menu_item_id=pk, hidden=False)
        return Response(ReviewSerializer(qs, many=True).data)


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAdminRole]


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Order.objects.all().order_by('-timestamp')
        params = self.request.query_params

        if user.role == 'customer':
            qs = qs.filter(customer=user)
        elif user.role == 'delivery':
            qs = qs.filter(type='delivery')
            if params.get('assigned') == 'me':
                qs = qs.filter(delivery_staff=user)
        # admin sees everything unless filtered explicitly
        if params.get('type'):
            qs = qs.filter(type=params['type'])
        if params.get('status'):
            qs = qs.filter(status=params['status'])
        return qs

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-date')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def toggle_hidden(self, request, pk=None):
        review = self.get_object()
        review.hidden = not review.hidden
        review.save(update_fields=['hidden'])
        return Response(self.get_serializer(review).data)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminRole]


class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        today = timezone.now().date()
        orders = Order.objects.all()
        today_orders = orders.filter(timestamp__date=today)
        pending_orders = orders.exclude(status__in=['Delivered', 'Collected', 'Cancelled'])
        revenue = orders.filter(status__in=['Delivered', 'Collected']).aggregate(s=Sum('total'))['s'] or 0
        low_stock = InventoryItem.objects.filter(current_stock__lte=F('min_stock'))

        return Response({
            'totalUsers': User.objects.count(),
            'todayOrders': today_orders.count(),
            'pendingOrders': pending_orders.count(),
            'revenue': revenue,
            'lowStockCount': low_stock.count(),
        })
