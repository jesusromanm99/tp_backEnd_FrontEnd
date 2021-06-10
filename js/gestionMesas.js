const ENDPOINT="http://localhost:9090/"

//obtiene todas las mesas para un restaurant
const get_todas_mesas= async(idRestaurant)=> {
    mesas= await fetch(ENDPOINT+"api/mesa/restaurantes/"+idRestaurant)
    if( mesas){
        return mesas.json()
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
            const data = res.json();
            return data;
        }    
    } catch (error) {
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
const app= new Vue({
    el:"#app",
    data:{
        restaurantes: [],
        mesas:[],
        idRestaurant: null,
        idMesa: null,
        mesa:null,
        
    },
    beforeCreate: async function() {
        try {
            this.restaurantes = await get_todos_restaurantes();   
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
            try {
                const obj = this.mesas.filter(mesa => mesa.id === this.idMesa)[0];
                obj.estado = await get_estado_mesa(this.idMesa); 
                if(obj.estado.id_cliente){
                    obj.cliente = await get_cliente(obj.estado.id_cliente)
                    obj.detalle = await get_consumo_detalle(obj.estado.id);
                }
                console.log(obj);
                this.mesa = obj;
            } catch (error) {
                console.error('Error en get estado de la mesa' + this.idMesa);
                console.error(error);
            }
            
        },
        onSelectMesa: async function (event) {
            this.idMesa = event.target.value;
        }
    }
})