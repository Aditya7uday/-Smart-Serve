from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('menu-items', views.MenuItemViewSet, basename='menuitem')
router.register('inventory', views.InventoryItemViewSet, basename='inventory')
router.register('orders', views.OrderViewSet, basename='order')
router.register('reviews', views.ReviewViewSet, basename='review')

urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset_password'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('users/', views.UserListView.as_view(), name='users'),
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    *router.urls,
]
