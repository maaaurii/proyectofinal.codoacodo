from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)  # Crear el objeto app de la clase Flask
CORS(app)  # Módulo CORS para permitir el acceso desde el frontend al backend

# Configurar la base de datos con el nombre del usuario y la clave
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/jugadores'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar la notificación de modificaciones

db = SQLAlchemy(app)  # Crear el objeto db de la clase SQLAlchemy
ma = Marshmallow(app)  # Crear el objeto ma de la clase Marshmallow

# Definir la tabla
class Jugador(db.Model):  # La clase Jugador hereda de db.Model
    id = db.Column(db.Integer, primary_key=True)  # Definir los campos de la tabla
    nombre = db.Column(db.String(100))
    dorsal = db.Column(db.Integer)
    posicion = db.Column(db.String(100))

    def __init__(self, nombre, dorsal, posicion):  # Crear el constructor de la clase
        self.nombre = nombre
        self.dorsal = dorsal
        self.posicion = posicion

# Crear todas las tablas
with app.app_context():
    db.create_all()

# Definir el esquema de la tabla
class JugadorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Jugador
        fields = ('id', 'nombre', 'dorsal', 'posicion')

# Instanciar los esquemas
jugador_schema = JugadorSchema()  # El objeto jugador_schema es para traer un jugador
jugadores_schema = JugadorSchema(many=True)  # El objeto jugadores_schema es para traer múltiples registros de jugador

# Crear los endpoints o rutas (JSON)
@app.route('/jugadores', methods=['GET'])
def get_jugadores():
    all_jugadores = Jugador.query.all()  # El método query.all() lo hereda de db.Model
    result = jugadores_schema.dump(all_jugadores)  # El método dump() lo hereda de ma.Schema
    return jsonify(result)  # Retorna un JSON de todos los registros de la tabla

@app.route('/jugadores/<id>', methods=['GET'])
def get_jugador(id):
    jugador = Jugador.query.get(id)
    if jugador:
        return jugador_schema.jsonify(jugador)  # Retorna el JSON de un jugador recibido como parámetro
    return jsonify({"message": "Jugador no encontrado"}), 404

@app.route('/jugadores/<id>', methods=['DELETE'])
def delete_jugador(id):
    jugador = Jugador.query.get(id)
    if jugador:
        db.session.delete(jugador)
        db.session.commit()
        return jugador_schema.jsonify(jugador)  # Devuelve un JSON con el registro eliminado
    return jsonify({"message": "Jugador no encontrado"}), 404

@app.route('/jugadores', methods=['POST'])
def create_jugador():
    nombre = request.json.get('nombre')
    dorsal = request.json.get('dorsal')
    posicion = request.json.get('posicion')
    if nombre and dorsal and posicion:
        new_jugador = Jugador(nombre, dorsal, posicion)
        db.session.add(new_jugador)
        db.session.commit()
        return jugador_schema.jsonify(new_jugador)
    return jsonify({"message": "Datos incompletos"}), 400

@app.route('/jugadores/<id>', methods=['PUT'])
def update_jugador(id):
    jugador = Jugador.query.get(id)
    if jugador:
        jugador.nombre = request.json.get('nombre', jugador.nombre)
        jugador.dorsal = request.json.get('dorsal', jugador.dorsal)
        jugador.posicion = request.json.get('posicion', jugador.posicion)
        db.session.commit()
        return jugador_schema.jsonify(jugador)
    return jsonify({"message": "Jugador no encontrado"}), 404

# Ruta para renderizar el archivo HTML
@app.route('/')
def index():
    return render_template('index.html')

# Programa principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)
