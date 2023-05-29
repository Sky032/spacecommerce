let addProductBtn = document.getElementById('buy_product__btn');
let deleteProductBtn = document.getElementById('delete_product__btn');

let cid = document.getElementById('cart_id').innerHTML
let pid = document.getElementById('delete_product__btn').value

// POST para agregar al carrito
const addProductToCart = async(cartId, productId) => {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();

    if(result.status === 'success') {
        Swal.fire({
            icon: 'success',
            title: 'Product added successfully',
            toast: true,
            position: 'top-right',
            timer: 1500,
            timerProgressBar: true
        })
    }

    if(result.status === 'error') {
        Swal.fire({
            icon: 'error',
            title: 'Ups.!',
            text: `${result.error}`,
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: 'Ok!'
        })
    }
}

addProductBtn.addEventListener('click', () => {
    const productId = addProductBtn.value;
    const cartId = cid
    addProductToCart(cartId, productId)
})

// DELETE product 
deleteProductBtn.addEventListener('click', () => {
    deleteProductFromDB(pid)
})

const deleteProductFromDB = async (pid) => {
    const response = await fetch(`/api/products/${pid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();

    if(result.status === 'success') {
        Swal.fire({
            title: 'Deleted...',
            icon: 'info',
            text: `You've deleted the product from the DB.`,
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: `<a href='https://spacecommerce-production-f145.up.railway.app/home'>Ti know!</a>`
        })
    }
    
    if(result.status === 'error') {
        Swal.fire({
            icon: 'error',
            title: 'Ups.!',
            text: `${result.error}`,
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: 'Ok!'
        })
    }
}