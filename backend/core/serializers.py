from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, InventoryItem, MenuItem, Order, Review

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(source='first_name')

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'phone', 'dorm_location']


class RegisterSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(source='first_name')
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'role', 'phone']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']


class MenuItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    categoryId = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), pk_field=serializers.CharField()
    )
    isVeg = serializers.BooleanField(source='is_veg')
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'categoryId', 'price', 'isVeg', 'rating', 'reviews',
            'description', 'image', 'available', 'customizations',
        ]


class InventoryItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    currentStock = serializers.IntegerField(source='current_stock')
    minStock = serializers.IntegerField(source='min_stock')
    status = serializers.ReadOnlyField()

    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'currentStock', 'minStock', 'unit', 'status']


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.PrimaryKeyRelatedField(
        source='customer', queryset=User.objects.all(), pk_field=serializers.CharField()
    )
    customerName = serializers.SerializerMethodField()
    paymentMethod = serializers.CharField(source='payment_method')
    deliveryStaffId = serializers.PrimaryKeyRelatedField(
        source='delivery_staff', queryset=User.objects.all(), allow_null=True, required=False,
        pk_field=serializers.CharField(),
    )
    dormLocation = serializers.CharField(source='dorm_location', required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customerId', 'customerName', 'items', 'total', 'type', 'status',
            'paymentMethod', 'timestamp', 'deliveryStaffId', 'dormLocation',
        ]
        read_only_fields = ['timestamp']

    def get_customerName(self, obj):
        return obj.customer.first_name or obj.customer.email


class ReviewSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    orderId = serializers.PrimaryKeyRelatedField(
        source='order', queryset=Order.objects.all(), allow_null=True, required=False,
        pk_field=serializers.CharField(),
    )
    itemId = serializers.PrimaryKeyRelatedField(
        source='menu_item', queryset=MenuItem.objects.all(), allow_null=True, required=False,
        pk_field=serializers.CharField(),
    )
    customerName = serializers.CharField(source='customer_name')

    class Meta:
        model = Review
        fields = ['id', 'orderId', 'itemId', 'customerName', 'rating', 'comment', 'date', 'hidden']
        read_only_fields = ['date']
