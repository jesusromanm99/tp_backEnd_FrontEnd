const ENDPOINT="http://localhost:9090/"

//obtiene todas las mesas para un restaurant
const get_todas_mesas= async(id_restaurant)=> {
    mesas= await fetch(ENDPOINT+"api/mesa/restaurantes/"+id_restaurant)
    if( mesas){
        return mesas.json()
    }
    
}
//obtiene todos los restaurantes
const get_todos_restaurantes = async()=>{
    const res = await fetch(`${ENDPOINT}api/restaurant/`);
    if(res){
        const data = res.json();
        return data;
    }
}
const app= new Vue({
    el:"#app",
    data:{
        restaurantes: [],
        mesas:[],
        idRestaurant: null,

    },
    beforeCreate: async function() {
        this.restaurantes = await get_todos_restaurantes();
    },
    methods:{
        onSelectRestaurant: async function (event){
            this.idRestaurant = event.target.value;
            this.mesas= await get_todas_mesas(this.idRestaurant)
        }
    }
})