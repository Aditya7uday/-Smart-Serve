from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Category, MenuItem

User = get_user_model()


class OrderFlowTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Snacks', icon='🍟')
        self.item = MenuItem.objects.create(
            category=self.category, name='Fries', price=60, is_veg=True,
        )

    def test_register_login_and_create_order(self):
        register_res = self.client.post('/api/auth/register/', {
            'name': 'Test Customer', 'email': 'flow@test.demo', 'password': 'testpass123',
        })
        self.assertEqual(register_res.status_code, 201)
        access = register_res.data['access']
        user_id = register_res.data['user']['id']

        login_res = self.client.post('/api/auth/login/', {
            'email': 'flow@test.demo', 'password': 'testpass123',
        })
        self.assertEqual(login_res.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        order_res = self.client.post('/api/orders/', {
            'customerId': user_id,
            'items': [{'id': self.item.id, 'name': self.item.name, 'price': 60, 'quantity': 2, 'customizations': []}],
            'total': 120,
            'type': 'delivery',
            'paymentMethod': 'Cash',
        }, format='json')
        self.assertEqual(order_res.status_code, 201)
        self.assertEqual(order_res.data['status'], 'Placed')
        self.assertEqual(float(order_res.data['total']), 120.0)

        # A different customer must not see this order
        other = User.objects.create_user(email='other@test.demo', password='x', role='customer')
        self.client.force_authenticate(user=other)
        list_res = self.client.get('/api/orders/')
        self.assertEqual(list_res.status_code, 200)
        self.assertEqual(len(list_res.data), 0)
        self.client.force_authenticate(user=None)

        # The owning customer cannot rewrite their own order (price/status tampering)
        order_id = order_res.data['id']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        tamper_res = self.client.patch(f'/api/orders/{order_id}/', {'status': 'Delivered'}, format='json')
        self.assertEqual(tamper_res.status_code, 403)
        self.client.credentials()

        # Delivery staff may only change status, not price/items
        rider = User.objects.create_user(email='rider@test.demo', password='x', role='delivery')
        self.client.force_authenticate(user=rider)
        overreach_res = self.client.patch(f'/api/orders/{order_id}/', {'total': 1}, format='json')
        self.assertEqual(overreach_res.status_code, 403)

    def test_register_cannot_grant_admin_role(self):
        res = self.client.post('/api/auth/register/', {
            'name': 'Sneaky', 'email': 'sneaky@test.demo', 'password': 'testpass123', 'role': 'admin',
        })
        self.assertEqual(res.status_code, 400)

    def test_customer_can_cancel_early_order_but_not_late_order(self):
        customer = User.objects.create_user(email='canceller@test.demo', password='x', role='customer')
        self.client.force_authenticate(user=customer)

        order_res = self.client.post('/api/orders/', {
            'customerId': customer.id,
            'items': [{'id': self.item.id, 'name': self.item.name, 'price': 60, 'quantity': 1, 'customizations': []}],
            'total': 60,
            'type': 'pickup',
            'paymentMethod': 'Cash',
        }, format='json')
        self.assertEqual(order_res.status_code, 201)
        order_id = order_res.data['id']

        # Still 'Placed' -> customer can cancel it themselves
        cancel_res = self.client.patch(f'/api/orders/{order_id}/', {'status': 'Cancelled'}, format='json')
        self.assertEqual(cancel_res.status_code, 200)
        self.assertEqual(cancel_res.data['status'], 'Cancelled')

        # A second order that's already out for delivery can no longer be self-cancelled
        order2_res = self.client.post('/api/orders/', {
            'customerId': customer.id,
            'items': [{'id': self.item.id, 'name': self.item.name, 'price': 60, 'quantity': 1, 'customizations': []}],
            'total': 60,
            'type': 'delivery',
            'paymentMethod': 'Cash',
        }, format='json')
        order2_id = order2_res.data['id']
        self.client.force_authenticate(user=User.objects.create_superuser(email='admin2@test.demo', password='x'))
        self.client.patch(f'/api/orders/{order2_id}/', {'status': 'Out for Delivery'}, format='json')

        self.client.force_authenticate(user=customer)
        late_cancel_res = self.client.patch(f'/api/orders/{order2_id}/', {'status': 'Cancelled'}, format='json')
        self.assertEqual(late_cancel_res.status_code, 403)

    def test_profile_update_persists_but_cannot_change_role(self):
        user = User.objects.create_user(email='profile@test.demo', password='x', role='customer')
        self.client.force_authenticate(user=user)

        res = self.client.patch('/api/auth/me/', {'name': 'Updated Name', 'phone': '9876543210'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['name'], 'Updated Name')
        self.assertEqual(res.data['phone'], '9876543210')

        escalate_res = self.client.patch('/api/auth/me/', {'role': 'admin'}, format='json')
        self.assertEqual(escalate_res.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.role, 'customer')
