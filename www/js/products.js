/**
 * Created by Madhu on 2/7/2015.
 */
// get the product list
$(function () {
    // this is for selecting the units of the product
    $(document).on('click','.productItemsBtn',function(e){
        var parent = $(this).parent();
        var productId = $(this).parent().parent().parent('.products').attr('id');
        var count_sec = $(this).siblings('.unitsCount');
        var count =  parseInt(count_sec.html());
        // addUnit is for checking which button is clicked
        var addUnit = $(this).hasClass('addProductUnit');
        var itemPrice_sec = $(this).parent().siblings().find('.productPrice');
        // item is the original unit price
        var item = parseFloat(parent.attr('id'));
        var itemPrice = parseFloat(itemPrice_sec.html());
        if(addUnit) {
            var itemsCount = parseInt(count + 1);
            var productPrice = parseFloat(item*itemsCount);
        } else {
            if(count > 1) {
                var itemsCount = parseInt(count - 1);
                var productPrice = parseFloat(item * itemsCount);
            }
        }
        count_sec.html(itemsCount);
        itemPrice_sec.html(productPrice);
        e.stopImmediatePropagation();
    });
    var cartItems = [];
    // this is for add to cart
    $(document).on('click','.addToCart',function(){
        // this is for collecting product objects
        var $this = $(this);
        var price = parseFloat($(this).siblings('.productPrice').html());
        var cart = [];
        // this is the product object
        cart.productId = this.id;
        // this is for getting the product price with checking how many units it holds
        cart.price =  price;
        cartItems.push(cart);
    });
});