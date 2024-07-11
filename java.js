$(document).ready(function () {
    // Función para obtener todos los jugadores

    const contadores = {
        'Arquero': 1,
        'Defensor Central Derecho': 2,
        'Defensor Central Izquierdo': 6,
        'Lateral Izquierdo': 3,
        'Lateral Derecho': 4,
        'Mediocampista Central': 5,
        'Mediocampista derecho': 7,
        'Mediocampista Izquierdo': 8,
        'Delantero': 9,
        'Extremo Izquierdo': 11,
        'Extremo Derecho': 10
    };


    function getJugadores() {
        $.ajax({
            url: 'http://localhost:5000/jugadores',
            method: 'GET',
            success: function (data) {
                let tableContent = '';
                data.forEach(jugador => {
                    tableContent += `
                        <tr>
                            <td>${jugador.id}</td>
                            <td>${jugador.nombre}</td>
                            <td>${jugador.dorsal}</td>
                            <td>${jugador.posicion}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editJugador(${jugador.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteJugador(${jugador.id})">Eliminar</button>
                            </td>
                        </tr>
                    `;
                    let id = contadores[jugador.posicion];
                    let circleHtml = `<div class="circle c${id}">
                        <div class="nombre">${jugador.nombre}</div>
                        <div class="sun"></div>
                    </div>`;
                    
                    $('.field .inner').append(circleHtml);
                });
                $('#jugadoresTable').html(tableContent);
            }
        });
    }

    // Llamar a getJugadores cuando la página se cargue
    getJugadores();

    // Manejar el formulario para agregar un nuevo jugador
    $('#addJugadorForm').on('submit', function (e) {
        e.preventDefault();

        const nombre = $('#nombre').val();
        const dorsal = $('#dorsal').val();
        const posicion = $('#posicion').val();

        $.ajax({
            url: 'http://localhost:5000/jugadores',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombre, dorsal, posicion }),
            success: function (data) {
                $('#nombre').val('');
                $('#dorsal').val('');
                $('#posicion').val('');
                getJugadores();  // Actualizar la lista de jugadores
            },
            error: function () {
                alert('Error al agregar el jugador');
            }
        });
    });

    // Manejar el formulario para editar un jugador
    $('#editJugadorForm').on('submit', function (e) {
        e.preventDefault();

        const id = $('#editId').val();
        const nombre = $('#editNombre').val();
        const dorsal = $('#editDorsal').val();
        const posicion = $('#editPosicion').val();

        $.ajax({
            url: `http://localhost:5000/jugadores/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ nombre, dorsal, posicion }),
            success: function (data) {
                $('#editForm').hide();
                $('#editId').val('');
                $('#editNombre').val('');
                $('#editDorsal').val('');
                $('#editPosicion').val('');
                getJugadores();  // Actualizar la lista de jugadores
            },
            error: function () {
                alert('Error al editar el jugador');
            }
        });
    });

    // Función para mostrar el formulario de edición con datos del jugador
    window.editJugador = function(id) {
        $.ajax({
            url: `http://localhost:5000/jugadores/${id}`,
            method: 'GET',
            success: function (data) {
                $('#editId').val(data.id);
                $('#editNombre').val(data.nombre);
                $('#editDorsal').val(data.dorsal);
                $('#editPosicion').val(data.posicion);
                $('#editForm').show();
            },
            error: function () {
                alert('Error al obtener los datos del jugador');
            }
        });
    }

    // Función para cancelar la edición y ocultar el formulario de edición
    $('#cancelEdit').on('click', function () {
        $('#editForm').hide();
        $('#editId').val('');
        $('#editNombre').val('');
        $('#editDorsal').val('');
        $('#editPosicion').val('');
    });

    // Función para eliminar un jugador
    window.deleteJugador = function(id) {
        $.ajax({
            url: `http://localhost:5000/jugadores/${id}`,
            method: 'DELETE',
            success: function () {
                getJugadores();  // Actualizar la lista de jugadores
            },
            error: function () {
                alert('Error al eliminar el jugador');
            }
        });
    }
});

