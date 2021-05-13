const ENDPOINT="http://localhost:9090/";

const get_todos_reservas = async() =>{
    const res = await fetch(`${ENDPOINT}api/reserva/`);
    if(res){
        const data = res.json();
        return data;
    }
}
const get_todos_restaurantes = async()=>{
    const res = await fetch(`${ENDPOINT}api/restaurant/`);
    if(res){
        const data = res.json();
        return data;
    }
}
const get_todos_clientes = async()=>{
    const res = await fetch(`${ENDPOINT}api/cliente/`);
    if(res){
        const data = res.json();
        return data;
    }
}
const get_restaurant = async(idRest) => {
    try {
        const res = await fetch(`${ENDPOINT}api/restaurant/${idRest}`);
        if(res){
            const data = res.json();
            return data;
        }    
    } catch (error) {
        console.error(error);
    }
}
const get_cliente = async(id) => {
    try {
        const res = await fetch(`${ENDPOINT}api/cliente/${id}`);
        if(res){
            const data = res.json();
            return data;
        }    
    } catch (error) {
        console.error(error);
    }
}
const get_mesa = async(id) => {
    try {
        const res = await fetch(`${ENDPOINT}api/mesa/${id}`);
        if(res){
            const data = res.json();
            return data;
        }    
    } catch (error) {
        console.error(error);
    }
}
const app= new Vue({
    el:"#app",
    data:{
        reservas:[],
        restaurantes:[],
        restaurant_index: -1,
        clientes:[],
        cliente_index: -1,
        fecha:null,

    },
    beforeCreate: async function() {
        const reservasRaw = await get_todos_reservas();
        
        for (let i = 0; i < reservasRaw.length; i++) {
            reservasRaw[i].restaurant = await get_restaurant(reservasRaw[i].id_restaurante);
            reservasRaw[i].cliente = await get_cliente(reservasRaw[i].id_restaurante);
            reservasRaw[i].mesa = await get_mesa(reservasRaw[i].id_restaurante);
        }
        this.reservas = reservasRaw;
        this.restaurantes = await get_todos_restaurantes();
        this.clientes = await get_todos_clientes();
        
        console.log(this.reservas);
    },
    methods:{
        filtrar: function(){
            console.log(this.restaurant_index);
        }
    }
})