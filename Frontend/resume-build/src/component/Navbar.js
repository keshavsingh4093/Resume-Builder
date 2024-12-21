
let url="https://reqres.in/api/users?page=2";
async function getdata() {
    try {
        let res = await fetch(url);
        let data= await res.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}