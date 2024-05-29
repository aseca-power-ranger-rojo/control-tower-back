from locust import HttpUser, TaskSet, task, between
import uuid  # Para generar un UUID aleatorio

class UserBehavior(TaskSet):


    @task(1)
    def create_order(self):
        order_id = str(uuid.uuid4())

        create_order_dto = {
            "orderId": order_id
        }

        response = self.client.post("/", json=create_order_dto)

        if response.status_code == 201:
            print(f"Order created successfully with orderId: {order_id}")
        else:
            print(f"Failed to create order. Status code: {response.status_code}")

    @task(1)
    def order_status(self):
        order_id = "id"
        step = "PICKING"
        status = "IN_PROGRESS"

        response = self.client.patch(f"/{order_id}/{step}/{status}")

        if response.status_code == 200:
            print(f"Order status updated successfully for orderId: {order_id}")
        else:
            print(f"Failed to update order status. Status code: {response.status_code}")

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)
