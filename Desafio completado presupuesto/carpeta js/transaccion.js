document.addEventListener("DOMContentLoaded", function() {
    // 1. Calcular y mostrar la fecha actual
    const fechaActual = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
    document.getElementById('mostrar-año').textContent = fechaFormateada;

    const transacciones = []; 

    const calcularSumas = (transacciones) => {
        return transacciones.reduce((acumulador, { tipo, monto }) => {
            if (tipo === "ingreso") {
                acumulador.ingresos += monto;
            } else if (tipo === "egreso") {
                acumulador.egresos += monto;
            }
            return acumulador;
        }, { ingresos: 0, egresos: 0 });
    };

    const actualizarValores = () => {
        const { ingresos, egresos } = calcularSumas(transacciones);
        const total = ingresos - egresos;

        // Calcular el porcentaje de gastos utilizando la fórmula proporcionada
        const porcentajeEgresos = (egresos * 100 / ingresos) || 0; // Se evita división por cero

        // Actualizar en el HTML
        document.getElementById("total-ingresos").textContent = `+${ingresos.toFixed(2)}`;
        document.getElementById("total-egresos").textContent = `-${egresos.toFixed(2)}`;
        document.getElementById("total-presupuesto").textContent = `${total >= 0 ? "+" : ""}${total.toFixed(2)}`;
        document.getElementById("porcentajeGastos").textContent = `${porcentajeEgresos.toFixed(2)}%`;
    };

    const manejarPestañas = () => {
        const tabIngresos = document.getElementById("tab-ingresos");
        const tabEgresos = document.getElementById("tab-egresos");
        const listaTransacciones = document.getElementById("lista-transacciones");

        // Filtra las transacciones según el tipo
        const filtrarTransacciones = (tipo) => {
            listaTransacciones.innerHTML = ""; 
            transacciones.forEach(transaccion => {
                if (transaccion.tipo === tipo) {
                    const nuevaTransaccion = document.createElement("li");
                    nuevaTransaccion.textContent = `${transaccion.descripcion} - $${transaccion.monto.toFixed(2)}`;

                    if (tipo === "egreso") {
                        const porcentajeDetalleEgreso = (transaccion.monto * 100 / calcularSumas(transacciones).ingresos).toFixed(2);
                        const spanPorcentaje = document.createElement("span");
                        spanPorcentaje.textContent = porcentajeDetalleEgreso + "%";
                        spanPorcentaje.style.backgroundColor = "black"; 
                        spanPorcentaje.style.color = "white"; 
                        spanPorcentaje.style.padding = "2px 5px"; 
                        spanPorcentaje.style.borderRadius = "3px"; 
                        spanPorcentaje.style.marginLeft = "10px"; 
                        nuevaTransaccion.appendChild(spanPorcentaje);
                    }

                    listaTransacciones.appendChild(nuevaTransaccion);
                }
            });
        };

        // Inicialmente muestra las transacciones de ingresos
        filtrarTransacciones("ingreso");

        // Event listeners para los botones
        tabIngresos.addEventListener("click", () => {
            tabIngresos.classList.add("active");
            tabEgresos.classList.remove("active");
            filtrarTransacciones("ingreso");
        });

        tabEgresos.addEventListener("click", () => {
            tabEgresos.classList.add("active");
            tabIngresos.classList.remove("active");
            filtrarTransacciones("egreso");
        });
    };

    // Llama a la función para manejar pestañas
    manejarPestañas();

    document.getElementById("transaction-form").addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        const tipo = document.getElementById("type").value;
        const descripcion = document.getElementById("description").value;
        const monto = parseFloat(document.getElementById("amount").value); 

        if (descripcion && !isNaN(monto) && monto > 0) {
            transacciones.push({ tipo, descripcion, monto });

            actualizarValores();
            document.getElementById("transaction-form").reset();
        } else {
            alert("Por favor, completa todos los campos correctamente."); 
        }
    });
});
