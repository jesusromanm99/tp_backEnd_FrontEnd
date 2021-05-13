var app= new Vue({
    el:"#app",
    data:{
        clientes:[]
    },
    methods:{
        get_clientes: function(){
            endpoint="http://localhost:9090/"
            fetch(endpoint+"api/cliente")
                .then(res=>res.json())
                .then(data=> {
                    this.clientes=data
                    console.log(data)
                }
                    
                )
           
        }
    }
})

