const ENDPOINT="http://localhost:9090/"

//obtiene todas las mesas para un restaurant
const get_todas_mesas= async(idRestaurant)=> {
    mesas= await fetch(ENDPOINT+"api/mesa/restaurantes/"+idRestaurant)
    if( mesas){
        return mesas.json()
    }
    
}
const get_todos_productos= async()=> {
    const productos = await fetch(ENDPOINT+"api/producto");
    if( productos){
        return productos.json()
    }
    
}
//obtiene todos los restaurantes
const get_todos_restaurantes = async()=>{
    const res = await fetch(`${ENDPOINT}api/restaurant/`);
    if(res){
        const data = await res.json();
        return data;
    }
}
const get_estado_mesa = async(idMesa) => {
    const res = await fetch(`${ENDPOINT}api/consumo/estaOcupada/${idMesa}`);
    if(res){
        return await res.json();
    }
    return null;
}
const get_cliente = async(id) => {
    try {
        const res = await fetch(`${ENDPOINT}api/cliente/${id}`);
        if(res){
            const data = await res.json();
            return data;
        }    
    } catch (error) {
        console.error(error);
    }
}
const get_totos_clientes = async () => {
    try {
        const res = await fetch(`${ENDPOINT}api/cliente`);
        if(res){
            const data = await res.json();
            return data;
        }
    } catch (error) {
        console.error('Error recuperando todos los clientes');
        console.error(error);
    }
}
const guardar_reserva = async(id_consumo, id_producto, cantidad ) => {
    try {
        const req = await fetch(`${ENDPOINT}api/consumo/addDetalle`, {
            method: 'POST',
            body:JSON.stringify({
                id_consumo,
                id_producto,
                cantidad
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(`Error guardando detalle de consumo ${id_consumo} producto ${id_producto}`);
        console.error(error);
    }

}
const get_consumo_detalle = async(idConsumo)=>{
    const res = await fetch(`${ENDPOINT}api/consumo/detalle/${idConsumo}`);
    if(res){
        const consumo = await res.json();
        for (let i = 0; i < consumo.length; i++) {
            consumo[i].producto = await (await fetch(`${ENDPOINT}api/producto/${consumo[i].id_producto}`)).json();   
        }
        return consumo;
    }
}
const crear_consumo = async(id_mesa, id_cliente ) => {
    try {
        const req = await fetch(`${ENDPOINT}api/consumo`, {
            method: 'POST',
            body:JSON.stringify({
                id_mesa,
                id_cliente
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(`Error guardando cabecera de consumo mesa ${id_mesa} cliente ${id_cliente}`);
        console.error(error);
    }

}
const cerrar_mesa = async(consumoId)=> {
    try {
        const req = await fetch(`${ENDPOINT}api/consumo/cerrarMesa/${consumoId}`,{
            method:'PUT'
        });   
    } catch (error) {
        console.error('Error cerrando la mesa');
        console.error(error);
    }

}
const cambiar_cliente = async(id, id_cliente) => {
    try {
        const req = await fetch(`${ENDPOINT}api/consumo`, {
            method: 'PUT',
            body:JSON.stringify({
                id,
                id_cliente
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        return await req.json();
    } catch (error) {
        console.error(`Error cambiando cabecera de consumo ${id} cliente ${id_cliente}`);
        console.error(error);
    }

}
const crear_cliente = async(clienteACrear ) => {
    try {
        const req = await fetch(`${ENDPOINT}api/cliente`, {
            method: 'POST',
            body:JSON.stringify(clienteACrear),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const data = await req.json();
        return data;
    } catch (error) {
        console.error(`Error guardando cliente ${clienteACrear.nombre} ${clienteACrear.apellido}`);
        console.error(error);
    }

}
const app= new Vue({
    el:"#app",
    data:{
        restaurantes: [],
        mesas:[],
        idRestaurant: null,
        idMesa: null,
        mesa:null,
        estadoMesa: null,
        productos:[],
        listaDetalles:[],
        cliente:null,
        detalleParaAgregar: {},
        modalAgregarDetalle: null,
        modalAgregarCliente: null,
        listadoClientes: [],
        listadoClientesFiltrado: [],
        clienteParaCrear: {
            nombre:"",
            apellido:"",
            cedula:"",
        },
        isShowingModalAgregarCliente: false,
    },
    beforeCreate: async function() {
        try {
            this.restaurantes = await get_todos_restaurantes();   
            this.productos = await get_todos_productos();
            this.listadoClientes = await get_totos_clientes();
            this.listadoClientesFiltrado = this.listadoClientes;
        } catch (error) {
            console.error('Error en get Restaurants');
            console.error(error);
        }
    },
    methods:{
        onSelectRestaurant: async function (event){
            this.idRestaurant = event.target.value;
            try {
                this.mesas = await get_todas_mesas(this.idRestaurant);
                this.mesas.unshift({value:0, nombre:'-- Seleccione una mesa --'});   
                this.idMesa = 0; 
            } catch (error) {
                console.error('Error en get mesas del restaurant' + this.idRestaurant);
                console.error(error);
            }
        },
        getEstadoMesa: async function(){
            this.cliente = null;
            this.listaDetalles = [];
            try {
                this.mesa = this.mesas.filter(mesa => mesa.id === this.idMesa)[0];
                this.estadoMesa = await get_estado_mesa(this.idMesa); 
                if(this.estadoMesa.id_cliente){
                    this.cliente = await get_cliente(this.estadoMesa.id_cliente)
                    this.listaDetalles = await get_consumo_detalle(this.estadoMesa.id);
                }
            } catch (error) {
                console.error('Error en get estado de la mesa' + this.idMesa);
                console.error(error);
            }
            
        },
        onSelectMesa: function (event) {
            this.idMesa = event.target.value;
        },
        handleModalAgregarChange: function(event){
            this.detalleParaAgregar = {
                ...this.detalleParaAgregar,
                [event.target.name]: event.target.value
            };
        },
        showModalAddDetalle: function (){
            const container = document.getElementById('modalAgregarDetalles');
            this.modalAgregarDetalle = new bootstrap.Modal(container); // relatedTarget
            this.modalAgregarDetalle.show();
        },
        handleChange: function () {
            
        },
        agregarDetalles: async function(event){
            
            try {
                await guardar_reserva( this.estadoMesa.id ,this.detalleParaAgregar.idProducto, this.detalleParaAgregar.cantidad);    
                this.modalAgregarDetalle.hide();
                this.getEstadoMesa();
            } catch (error) {
                console.error(`Error guardando detalle del consumo ${this.mesa.id} producto ${this.detalleParaAgregar.idProducto}`)
                console.error(error);
            }
        },
        seleccionarCliente: async function(idCliente){
            if(!this.cliente){ //La mesa esta abierta
                await crear_consumo(this.idMesa, idCliente);
            }else{
                const data = await cambiar_cliente( this.estadoMesa.id, idCliente );
            }
            
            await this.getEstadoMesa();
            this.modalAgregarCliente.hide();
        },
        agregarCliente: async function(){

        },
        showModalAddCliente: function(){
            const container = document.getElementById('modalAgregarCliente');
            this.modalAgregarCliente = new bootstrap.Modal(container); // relatedTarget
            this.modalAgregarCliente.show();
        }, 
        cerrarMesa: async function(){
            await cerrar_mesa(this.estadoMesa.id);
            this.getEstadoMesa();
        },
        cerrarModalAgregarCliente: function(){
            this.modalAgregarCliente.hide();
        },
        cerrarModalAgregarDetalles: function(){
            this.modalAgregarDetalle.hide();
        },
        showModalAgregarCliente: function(){
            this.isShowingModalAgregarCliente = !this.isShowingModalAgregarCliente;
        },
        handleAgregarClienteChange: function(event){
            this.clienteParaCrear = {
                ...this.clienteParaCrear,
                [event.target.name]: event.target.value
            }
        },
        saveAndSetCliente: async function(){
            try {
                const nuevoCliente = await crear_cliente(this.clienteParaCrear);
                if(nuevoCliente){
                    if(this.cliente){
                        await cambiar_cliente(this.estadoMesa.id, nuevoCliente.id);
                    }else{
                        //crear consumo
                        await crear_consumo( this.idMesa, nuevoCliente.id);
                    }
                    this.cliente = nuevoCliente;
                    
                    await this.getEstadoMesa();
                    this.cerrarModalAgregarCliente();
                }else{
                    console.log('ERROR: No se creo nuevo cliente...')
                }
            } catch (error) {
                console.error('Error creando consumo o cliente');
                console.error(error);
            }
            
            
        },
    }
})