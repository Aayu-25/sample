# Import required libraries
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///orders.db'
db = SQLAlchemy(app)

class OrderService:
    def create_order(self, user_id, data):
        order = Order(user_id=user_id, **data)
        db.session.add(order)
        db.session.commit()
        return order

    def get_order(self, order_id):
        return Order.query.get(order_id)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

order_service = OrderService()

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    user_id = data['user_id']
    order = order_service.create_order(user_id, data)
    return jsonify({'id': order.id, 'user_id': order.user_id, 'product': order.product, 'quantity': order.quantity})

@app.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = order_service.get_order(order_id)
    if order:
        return jsonify({'id': order.id, 'user_id': order.user_id, 'product': order.product, 'quantity': order.quantity})
    return jsonify({'error': 'Order not found'}), 404
