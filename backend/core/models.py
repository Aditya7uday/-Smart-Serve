from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('delivery', 'Delivery'),
    ]
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, blank=True)
    dorm_location = models.CharField(max_length=200, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_veg = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    reviews_count = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True, max_length=500)
    available = models.BooleanField(default=True)
    customizations = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name


class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    current_stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=0)
    unit = models.CharField(max_length=20, default='pcs')

    @property
    def status(self):
        if self.current_stock == 0:
            return 'Out of Stock'
        if self.current_stock <= self.min_stock:
            return 'Low Stock'
        return 'In Stock'

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('Placed', 'Placed'),
        ('Confirmed', 'Confirmed'),
        ('Accepted', 'Accepted'),
        ('Preparing', 'Preparing'),
        ('Picked Up', 'Picked Up'),
        ('Ready', 'Ready'),
        ('Ready for Pickup', 'Ready for Pickup'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Collected', 'Collected'),
        ('Cancelled', 'Cancelled'),
    ]
    TYPE_CHOICES = [('delivery', 'Delivery'), ('pickup', 'Pickup')]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    items = models.JSONField(default=list)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Placed')
    payment_method = models.CharField(max_length=30, default='Cash')
    timestamp = models.DateTimeField(auto_now_add=True)
    delivery_staff = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name='deliveries'
    )
    dorm_location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f'Order #{self.id}'


class Review(models.Model):
    order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviews')
    menu_item = models.ForeignKey(
        MenuItem, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviews'
    )
    customer_name = models.CharField(max_length=150)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    hidden = models.BooleanField(default=False)

    def __str__(self):
        return f'Review #{self.id}'
