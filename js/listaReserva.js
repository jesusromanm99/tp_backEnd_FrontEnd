const ENDPOINT="http://localhost:9090/";

const get_todos_reservas = async() =>{
    const res = await fetch(`${ENDPOINT}api/reserva/`);
    if(res){
        const data = res.json();
        return data;
    }
}
const compare_dates = (date1, date2) =>{
    //console.log( date1.getDate(), date1.getMonth(), date1.getYear() );
    //console.log( date2.getDate(), date2.getMonth(), date2.getYear() );
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getYear() === date2.getYear();
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
        allReservas:[],
        showingReservas:[],
        restaurantes:[],
        restaurant_index: 0,
        clientes:[],
        cliente_index: 0,
        fecha:null,

    },
    beforeCreate: async function() {
        let reservasRaw = await get_todos_reservas();
        
        for (let i = 0; i < reservasRaw.length; i++) {
            reservasRaw[i].restaurant = await get_restaurant(reservasRaw[i].id_restaurante);
            reservasRaw[i].cliente = await get_cliente(reservasRaw[i].id_cliente);
            reservasRaw[i].mesa = await get_mesa(reservasRaw[i].id_mesa);
        }
        reservasRaw = reservasRaw.sort( (reserva1, reserva2) => {
            if(reserva1.fecha < reserva2.fecha){
                return -1;
            }else if(reserva1.fecha > reserva2.fecha){
                return 1;
            }
            const resDif = reserva1.hora_inicial - reserva2.hora_inicial;
            if(resDif) return resDif;
            else return reserva1.id_mesa - reserva2.id_mesa;
        } );
        this.allReservas = reservasRaw;
        this.showingReservas = reservasRaw;
        this.restaurantes = await get_todos_restaurantes();
        this.clientes = await get_todos_clientes();
        
        console.log(this.showingReservas);
    },
    methods:{
        filtrar: function(){
            let reservasAux = this.allReservas;
            if(this.restaurant_index){
                reservasAux = reservasAux.filter(reserva=> parseInt(reserva.id_restaurante) === this.restaurant_index);
            }
            if(this.cliente_index){
                reservasAux = reservasAux.filter(reserva=> parseInt(reserva.id_cliente) === this.cliente_index);
            }
            if(this.fecha){
                reservasAux = reservasAux.filter(reserva=>(reserva.fecha.substring(0, 10) === this.fecha));
            }
            this.showingReservas = reservasAux;
            console.log(this.allReservas);
        }
    }
})