from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import Category, InventoryItem, MenuItem, Order, Review, User

CATEGORIES = [
    ('Burgers', '🍔'), ('Pizzas', '🍕'), ('Beverages', '🥤'),
    ('Snacks', '🍟'), ('Healthy', '🥗'), ('Desserts', '🍨'),
]

MENU_ITEMS = [
    dict(name='Classic Chicken Burger', category=0, price=120, is_veg=False, rating=4.5, reviews_count=124,
         description='Juicy grilled chicken patty with fresh lettuce, tomatoes, and our signature sauce.',
         image='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
         customizations=[{'name': 'Extra Cheese', 'price': 20}, {'name': 'Spicy Mayo', 'price': 10}, {'name': 'Add Bacon', 'price': 40}]),
    dict(name='Veggie Supreme Pizza', category=1, price=250, is_veg=True, rating=4.8, reviews_count=89,
         description='Loaded with bell peppers, olives, onions, mushrooms, and mozzarella.',
         image='https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80',
         customizations=[{'name': 'Extra Cheese', 'price': 30}, {'name': 'Thin Crust', 'price': 0}]),
    dict(name='Cold Coffee', category=2, price=80, is_veg=True, rating=4.2, reviews_count=210,
         description='Refreshing cold coffee blended with ice cream and chocolate syrup.',
         image='https://images.unsplash.com/photo-1461023058943-0708e5215091?auto=format&fit=crop&w=500&q=80',
         customizations=[{'name': 'Add Vanilla Ice Cream', 'price': 20}, {'name': 'Extra Chocolate', 'price': 10}]),
    dict(name='French Fries', category=3, price=60, is_veg=True, rating=4.6, reviews_count=156,
         description='Crispy golden fries salted to perfection.',
         image='https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80',
         customizations=[{'name': 'Peri Peri Spice', 'price': 10}, {'name': 'Cheese Dip', 'price': 15}]),
    dict(name='Caesar Salad', category=4, price=150, is_veg=True, rating=4.1, reviews_count=45,
         description='Fresh romaine lettuce, croutons, parmesan cheese with Caesar dressing.',
         image='https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=80',
         customizations=[{'name': 'Add Grilled Chicken', 'price': 60}]),
    dict(name='Chocolate Lava Cake', category=5, price=110, is_veg=True, rating=4.9, reviews_count=320,
         description='Warm chocolate cake with a gooey molten chocolate center.',
         image='https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80',
         available=False,
         customizations=[{'name': 'With Vanilla Scoop', 'price': 30}]),
]
MENU_ITEMS += [
    dict(name=f'Delicious Item {i + 7}', category=i % 6, price=50 + i * 5, is_veg=i % 2 == 0,
         rating=4.0 + (i % 10) / 10, reviews_count=(i * 7) % 200,
         description=f'A delicious mock item for category {(i % 6) + 1}. Made with fresh ingredients.',
         image='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
         customizations=[])
    for i in range(24)
]

USERS = [
    ('John Customer', 'customer@smartserve.demo', 'password', 'customer'),
    ('Jane Admin', 'admin@smartserve.demo', 'password', 'admin'),
    ('Mike Delivery', 'delivery@smartserve.demo', 'password', 'delivery'),
    ('Alice Student', 'alice@smartserve.demo', 'password', 'customer'),
    ('Bob Delivery', 'bob@smartserve.demo', 'password', 'delivery'),
]

INVENTORY = [
    ('Burger Buns', 150, 50, 'pcs'),
    ('Chicken Patties', 30, 40, 'pcs'),
    ('Pizza Base', 0, 20, 'pcs'),
    ('Coffee Beans', 5, 2, 'kg'),
    ('Cheese Slices', 200, 100, 'pcs'),
]


class Command(BaseCommand):
    help = 'Seed the database with Smart Serve demo data'

    def handle(self, *args, **options):
        Review.objects.all().delete()
        Order.objects.all().delete()
        MenuItem.objects.all().delete()
        Category.objects.all().delete()
        InventoryItem.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        categories = [Category.objects.create(name=name, icon=icon) for name, icon in CATEGORIES]

        menu_items = []
        for data in MENU_ITEMS:
            cat = categories[data.pop('category')]
            menu_items.append(MenuItem.objects.create(category=cat, **data))

        users = []
        for name, email, password, role in USERS:
            first, _, last = name.partition(' ')
            user = User.objects.create_user(
                email=email, password=password, first_name=first, last_name=last, role=role,
            )
            users.append(user)

        for name, current, minimum, unit in INVENTORY:
            InventoryItem.objects.create(name=name, current_stock=current, min_stock=minimum, unit=unit)

        order1 = Order.objects.create(
            customer=users[0],
            items=[
                {'id': menu_items[0].id, 'name': menu_items[0].name, 'price': 120, 'quantity': 2, 'customizations': ['Extra Cheese']},
                {'id': menu_items[3].id, 'name': menu_items[3].name, 'price': 60, 'quantity': 1, 'customizations': []},
            ],
            total=320, type='delivery', status='Preparing', payment_method='UPI',
            dorm_location='Block B, Room 204',
        )
        Order.objects.create(
            customer=users[3],
            items=[{'id': menu_items[2].id, 'name': menu_items[2].name, 'price': 80, 'quantity': 1, 'customizations': []}],
            total=80, type='pickup', status='Ready for Pickup', payment_method='Cash',
        )

        Review.objects.create(order=order1, customer_name='John Customer', rating=5, comment='Food was hot and delicious!')
        Review.objects.create(customer_name='Alice Student', rating=3, comment='Delivery was a bit late.')

        self.stdout.write(self.style.SUCCESS(
            f'Seeded {len(categories)} categories, {len(menu_items)} menu items, {len(users)} users, '
            f'{len(INVENTORY)} inventory items, 2 orders, 2 reviews.'
        ))
