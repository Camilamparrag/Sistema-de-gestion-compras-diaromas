async function init() {
    try {
        const response = await fetch('assets/js/data.json');
        const data = await response.json();
        renderDashboard(data.productos);
    } catch (e) {
        console.error("Error cargando datos", e);
    }
}

function renderDashboard(productos) {
    const tableBody = document.querySelector('#products-table tbody');
    let alertasCount = 0;
    let topProduct = productos[0];

    tableBody.innerHTML = productos.map(p => {
        // Lógica de Alta Rotación
        if (p.ventas_mes > topProduct.ventas_mes) topProduct = p;
        
        // Lógica de Alerta de Stock
        const necesitaCompra = p.stock <= p.minimo;
        if (necesitaCompra) alertasCount++;

        const statusClass = necesitaCompra ? 'status-low' : 'status-ok';
        const sugerencia = necesitaCompra ? `Comprar ${p.minimo * 2} u.` : 'Stock suficiente';

        return `
            <tr>
                <td><strong>${p.nombre}</strong><br><small>${p.categoria}</small></td>
                <td>${p.stock}</td>
                <td>${p.ventas_mes}</td>
                <td><span class="badge ${statusClass}">${necesitaCompra ? 'Bajo' : 'Óptimo'}</span></td>
                <td>${sugerencia}</td>
            </tr>
        `;
    }).join('');

    // Actualizar indicadores superiores
    document.getElementById('top-product').innerText = topProduct.nombre;
    document.getElementById('stock-alerts').innerText = `${alertasCount} productos bajos`;
    document.getElementById('current-date').innerText = new Date().toLocaleDateString();
}

init();