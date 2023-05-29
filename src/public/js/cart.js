let deleteProductBtn = document.querySelectorAll('#delete_btn');
let cartBtn = document.getElementById('purchase');
let emptyCart = document.getElementById('empty_cart');
let cid =  document.getElementById('purchase').value;

console.log(cid);

// DELETE para eliminar producto del carrito

deleteProductBtn.forEach((b) => {
    b.addEventListener("click", (e) => {
        e.preventDefault()
        const pid = b.value;
        deleteProduct(cartBtn.value, pid);
    });
});

const deleteProduct = async(cid, pid)=> {
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json()
    
    if(result.status === 'success') {
        Swal.fire({
            icon: 'warning',
            title: 'Product deleted successfully',
            text: 'Please, reload de page to see your actualized cart.',
            showConfirmButton: true,
            confirmButtonText: 'Ok.!'
        })
    }
}

// Empty cart
emptyCart.addEventListener('click', () =>{
    deleteAllProducts(cid);
})

const deleteAllProducts = async(cid) =>{
    const response = await fetch(`/api/carts/${cid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json()

    if(result.status === 'success') {
        Swal.fire({
            icon: 'warning',
            title: 'All products have been removed from the cart. Please, refresh the page!',
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: 'Got it!'
        })
    }
}


// POST para confirmar ticket 
cartBtn.addEventListener("click", (e) => {
    e.preventDefault()
    confirmTicket(cartBtn.value)
})

const confirmTicket = async(cid) => {
    try {
        const response = await fetch(`/carts/${cid}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Your purchase is complete! Check for confirmation email in your inbox.',
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: `<a href='https://spacecommerce-production-f145.up.railway.app/carts/${cid}/payment'>To deploy page.</a>`,
                allowOutsideClick: false
            })
        }
        if (result.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'There are no products un the cart.',
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: `<a href='https://spacecommerce-production-f145.up.railway.app/products'>Ok!</a>`,
                allowOutsideClick: false
            })
        }
    } catch (error) {
        console.error(`Error en cart.js ----> ${error.message}`);
    }
}