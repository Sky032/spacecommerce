// Elementos del DOM
// let btnNewProduct = document.getElementById('btn_new-product');
// let deleteProductBtn = document.querySelector('#delete_product_btn');
let sendBtn = document.getElementById('send-btn');
let addProductBtn = document.querySelectorAll('#buy_product__btn');
let cartId = document.getElementById('cart_id').innerHTML;

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
            title: 'Success.!',
            icon: 'success',
            text: 'Product added successfully',
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

addProductBtn.forEach(b => {
    b.addEventListener('click', ()=> {
        const productId = b.value;
        addProductToCart(cartId, productId)
    })
})

