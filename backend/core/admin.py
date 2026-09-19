from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Category, InventoryItem, MenuItem, Order, Review, User

admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(MenuItem)
admin.site.register(InventoryItem)
admin.site.register(Order)
admin.site.register(Review)
