/**
 * Created by Madhu on 2/11/2015.
 */
// global variables

var savedOrder = 'off';
var saveorderStatus = 'false';  


/*if (navigator.onLine) {  
alert("online");   
} else{
alert("offline");
}*/





// $(document).ajaxStart(function(){
//     $(".loader_sec").show();
//     })
//   .ajaxStop(function(){
//       $(".loader_sec").hide();
//   });

$(function(){
    $('.home-content').hide();
    //$('#linkNavigation').html(localStorage.getItem('data'));

 localStorage.removeItem('SavedOrders');
 localStorage.removeItem('removeOrderId');
var cartId = '';
localStorage.setItem("cartId",'');
cartDetails = [];

// header params
    headerParams = {
            DID     : localStorage.getItem("uuid"),//'14e5fabb-33a0-4812-a54d-1d0fe672fc41',            
            TokenID :  localStorage.getItem('TokenID')
        }


// hide the buttons when the page loads

$('.saveorder_btn,.cartsummary_btn,.table-number-box').hide();


    var cartTotal = function(units,price){
        cartTotal = units*price;
        $('.cart_units_count').html(unitsQty);
        $('.cart_Price').html(cartTotal);
        return cartTotal;
    }
    // this is for calculating individual product price when no units change
    cartDetails = [];
    $(document).on('click','.product_itm a', function(){          
        var elem = $(this);
        //debugger;
        //var mappedProduct=productDetails(elem);
        if(localStorage.getItem('removeOrderID') != '' && savedOrder == 'off'){
            $('.table-number-box').show();
        } else {
            $('.table-number-box').hide();
        }
        $('.saveOrder').removeAttr('disabled');
        $('.orderName').show();
        addProduct(productDetails(elem));
        // to check and update the existing product
        updateProductQuantity(cartDetails);
        //$('#myImg').html('');
    });

    // key up function
    //$('.unitsQty').keyup(function(){
    // $(document).on('keyup change blur','.unitsQty',function(){
    //     var elem = $(this);
    //     if(elem.val() == ''){
    //        // alert(typeof($(this).val()));
    //         elem.val('0');
    //     }
    //     //return false;
    //     if(elem.val()) {
    //         addProduct(productDetails(elem));
    //         // to check and update the existing product
    //         updateProductQuantity(cartDetails);
    //     }
    // });

    var productDetails = function(elem){
        //debugger;
        addUnit = elem.attr('class');
        removeUnit = elem.attr('class');
        var parent = $(elem).closest('.product_itm'),
            unit = parent.find('.unitsQty'),
            productId = parent.attr('id'),
            
            unitsQty = parseFloat(unit.val());
        if(addUnit == 'addUnits' || addUnit == 'addUnits changeItm'){
            var Quantity = parseFloat(unitsQty+1);
        } else if(removeUnit == "removeUnits" || removeUnit == "removeUnits changeItm") {
            if(unitsQty!=0) {
                var Quantity = parseFloat(unitsQty - 1);
            } else {
                var Quantity = 0;
            }
        } else {
            var Quantity = parseFloat(unitsQty);
        }
        var unitPrice = unit.attr('id'),
            price_sec = parent.find('.product_price'),
            product_Name = parent.find('.product_Name').html(),
            price = parseFloat(parent.find('.product_price').html()),
            productTotal = parseFloat(Quantity*unitPrice);
        unit.val(Quantity);
        price_sec.html(productTotal.toFixed(2));
        if(Quantity==0){
            price_sec.html(unitPrice);
        }
        var cartTotal = parseFloat(Quantity*unitPrice);
        var cart = {
            ProductID : productId,
            Quantity : Quantity,
            price : productTotal,
            productName : product_Name,
            unitPrice : unitPrice,
            deleted : false
        };
        return cart;
    }

    var addProduct = function(cart){
        var productExists = false;
        for(i=0;i<cartDetails.length;i++) {
            if (cartDetails[i].ProductID == cart.ProductID) {
                cartDetails[i].Quantity = cart.Quantity;
                cartDetails[i].price = cart.price;
                productExists = true;
                break; //Stop this loop, we found it!
            }
        }
        if(!productExists){
            cartDetails.push(cart);
        }
    }

    /*$('.unitsQty').keyup(function(){
        var units='';
        var price='';
        var productId='';
        if(!cartDetails.length){
        }else{
        }
        var unitsQty =  $(this).val(),
            price = parseFloat($(this).closest('li').find('.product_price').html());
        updateProductQuantity()
    });*/

    $(document).on("click ", '.changeItm', function (elem) {
        var elem = $(this);
        //console.log(elem);
        var product=productDetails(elem);
        //console.log(product);
        addProduct(product);
        // to check and update the existing product
        updateProductQuantity(cartDetails);
        updateGrandTotal(cartDetails);
    });
    // this is for calculating
    var updateGrandTotal = function(cartDetails){
        var grandTotalPrice=0;
        $.each(cartDetails,function(key,val){
            grandTotalPrice += val.price;
        });
        $('.grandTotal').html(grandTotalPrice.toFixed(2));

    }

    var updateProductQuantity = function(cartDetails){
       // debugger;
        var totalUnits=0;
        var totalPrice=0;
        $.each(cartDetails,function(key,val){
            if(!val.deleted){
                totalUnits += val.Quantity;
                totalPrice += val.price;
            }
        });
        if(totalUnits > 0){
            $('.empty_cart').hide();
            $('.productsTotal').show();
            $('.cart_units_count').html(totalUnits);
            var cart_price = $('.cart_Price').html(totalPrice.toFixed(2));
            $('.grandTotal,.sub_total').html(totalPrice.toFixed(2));
            $('.saveorder_btn,.cartsummary_btn').show();
        } else {
            $('.saveorder_btn,.cartsummary_btn,.table-number-box').hide();
            $('.productsTotal').hide();            
            $('.empty_cart').show();
        }
        // if($('.cartsummary_btn:visible') && $('.checkout-wrapper:visible')){
        //     $('.saveorder_btn').hide();
        // } else if($('.saveorder_btn:visible') && $('.checkout-wrapper:visible')){
        //     $('.cartsummary_btn').hide();   
        //     $('.saveorder_btn').show();         
        // }
        //if('.saveorder_btn')

    }
    $('.saveOrder').click(function(){
        var orderName = $('.orderName').val();
        localStorage.setItem(orderName,JSON.stringify(cartDetails));
        // console.log(localStorage.getItem(orderName));
    });

    // payment methods
   

    // cash method function
    $('.payment_methods').click(function(e){
       // $('.cashMethod,.eftposMethod,.creditMethod').hide();
        //$('#cash_checkout,#credit_checkout,#eftpos_checkout').attr('disabled','true');
        //debugger;
        var $this = this.id;
        var paymentType = this.id.split('_')[0];
        localStorage.setItem('PaymentMethod',paymentType);
        var cashValue = '';
        switch($this){
            case "Cash_checkout":  
            //debugger;
                cashValue = 1;    
                $('#CashValue').val('1');
                var cashIn = $('#cashIn').val();
                var grandTotal = $('.grandTotal').html();
                var Cash = parseFloat(cashIn).toFixed(2);
                // if( grandTotal > Cash){
                if( Cash < grandTotal || grandTotal > Cash){
                    // alert('Amount Mismatched');
                    navigator.notification.alert('Amount Mismatch');
                    // e.stopPropagation();
                     e.stop();
                }
               
                //$('.cashMethod').show();
                break;
            case "Card_checkout":
                cashValue = 3;
                $('#cashValue').val('3');
                //$('.eftposMethod').show();
                break;
            case "credit_checkout":
                cashValue = 2;
                $('#cashValue').val('2');   
               //$('.creditMethod').show();
                break;
                
        }    
         localStorage.setItem('payMethod',cashValue) 
         return cashValue;   
        

    });
    var cashOut = '';

    $('#cashIn').change(function(){
        //debugger;
        var total = $('.grandTotal').html();
        var cashIn = $(this).val();
        var totalamt = cashIn - total;
        if(totalamt >= 0){
            cashOut = totalamt; 
            alert(cashOut);
            $('body').prepend('<input type="hidden" id="cashOut" value="'+cashOut+'" />');
            $('#cash_checkout').removeAttr('disabled');
        }
        //alert(cashOut)
        //localStorage.setItem('cashOut',cashOut)

    });

// start add to cart functionality
// addtocart btn renamed to cartsummary
 var mergeCartItems=function(){
   // debugger;
 var removeOrderId= localStorage.getItem('removeOrderId');
  if(removeOrderId!="" && removeOrderId!=null){
 var SavedOrders=JSON.parse(localStorage.getItem('SavedOrders'));
 var _cartDetails=cartDetails;
 if(_cartDetails.length>0){
   var _cartItem=$.grep(SavedOrders,function(element){
   return element.orderName==removeOrderId;
   });

   $.each(_cartItem[0].selectedItems,function(key,val){
    // console.log(val);
    
         var _grepedItems= $.grep(_cartDetails,function(elem){
            return elem.ProductID==val.ProductID;
                                  
            
          });
         if(_grepedItems.length==0){
            _cartDetails.push(val);
         }else{
             val.Quantity+=_grepedItems.Quantity;
              val.price+=_grepedItems.price;
         }

   });
   cartDetails=_cartDetails;
   return cartDetails;
}
}

}





    $(document).on('click','.cartsummary_btn',function(){
        mergeCartItems();
        localStorage.setItem("checkOutOrderDetails", JSON.stringify(cartDetails));
        loadCheckOutDetails(cartDetails,getProductPrice(cartDetails));
      
        //addtocart(cartDetails);
        //$('.saveorder_btn').hide();
        $('.place-order-overlay').hide();
        $('.place_Order').show();
    });




    // end of add to cart btn click
var adjustProducts=function(cart){
    var Cart=[];//cart.length>0?cart:localStorage.getItem('checkOutOrderDetails');
    if(cart.length>0){
        $.each(cart,function(key,val){
            if(!val.deleted){
                Cart.push(val);
            }
        });

    } else{
      var item=  localStorage.getItem('removeOrderId');
      var savedOrders=JSON.parse(localStorage.getItem('SavedOrders'));
        $.each(savedOrders,function(key,val){
       if(val.orderName==item){
          $.each(val.selectedItems,function(key,_val){
            if(!_val.deleted){
                Cart.push(_val);

            }
          });
       }
        });
            
    }
    return Cart;

}

    var addtocart = function(cart){
        $(".loader_sec").show();
        //debugger;
         var products = { 
            'Products' : adjustProducts(cart)
       };

       localStorage.setItem('printProducts',JSON.stringify(products));


        addtocartheaders = {
            DID   : localStorage.getItem("uuid"),//'14e5fabb-33a0-4812-a54d-1d0fe672fc41',
            TokenID :  window.token
        }
       // console.log(JSON.stringify({"Products":cartDetails}));
        $.ajax({
            url : 'http://point-of-sale.gtsinteractive.com/gtsiposws/addtocart',
            type : 'POST',
            dataType : 'JSON',
            headers : addtocartheaders,
            data : products,
            async : false,
            success : function(data){
                if(data.ResultCode == 0){                         
                    cartId = data.CartId;
                    localStorage.setItem("cartId",cartId);
                    console.log('addtoCart: '+cartId);
                    $('.checkout_btn').attr('id','checkout_Cart');
                    $(".loader_sec").hide();
                } else {
                    navigator.notification.alert(data.Message)
                }
            },
            error : function(error){
                // navigator.notification.alert('transaction failed');
                navigator.notification.alert(
                              "Transaction Failed",    // message
                              null,       // callback
                              "Please try again", // title
                              'OK'        // buttonName
                          );
            }

        });   
    }


    // start add discount
    $('.apply_coupon').click(function(){
        //debugger;
        var isOnline=localStorage.getItem("isDeviceOnline");
        if(isOnline=="true"){
        var cartId = localStorage.setItem('cartId','');
        if(cartId == '' || cartId == undefined){
            $.when(addtocart(cartDetails)).done(function(){  
                var cartId = localStorage.getItem('cartId');              
                if(cartId!=''){
                    getDiscount();                    
                }
            });
        } else {
            getDiscount();
        }
    }else{
        getOfflineDiscount();
    }

    });
    var getOfflineDiscount=function(){
        var discountCode = $('.coupon_code').val();
        var db = window.sqlitePlugin.openDatabase("PosApp", "1.0", "Demo", -1);
             db.transaction(function(tx) {
            tx.executeSql('SELECT * from Discounts Where CouponCode = ?',[discountCode],
                  DiscountCallBack, 
                errorCB1//error callback               
                  );                 });    
    };
    var DiscountCallBack=function(tx,results){
     var discountAmount=results.rows.item(0).DiscountAmount;
     localStorage.setItem('DiscountType',results.rows.item(0).DiscountType);
     localStorage.setItem('DiscountID',results.rows.item(0).DiscountID);
     // localStorage.setItem('UsageType',results.rows.item(0).UsageType);
     var usageType = results.rows.item(0).UsageType;
     var sub_total = $('.sub_total').html();

     if(usageType == 1){
         var totalamt = (sub_total - discountAmount).toFixed(2);
         if(totalamt < 0){
            $('.grandTotal').html('0.00')
         } else {
            $('.grandTotal').html(totalamt)
        }
        $(".discount_amt").html(discountAmount);
        $(".discount_Amt_Sec").show();
    } else {
         var disc = sub_total * (discountAmount / 100).toFixed(2);
         var totalamt = sub_total - disc;
         if(totalamt < 0){
            $('.grandTotal').html('0.00');
         } else {
            $('.grandTotal').html(totalamt);
        }
        $(".discount_amt").html(disc);
        $(".discount_Amt_Sec").show();
    }
        $(".coupon_code").val("");

     //
     //alert(discountAmount);
    };
    var getDiscount = function(){
        //debugger;
        var discountCode = $('.coupon_code').val();
        discount = {
            CartID : localStorage.getItem("cartId"),
            CodeType : 1,
            Code : discountCode,
            Action : 1
        };
        // headers
        addDiscountHeaders = {
            DID   : localStorage.getItem("uuid"),//'14e5fabb-33a0-4812-a54d-1d0fe672fc41',
            TokenID :  window.token
        };
        if(discountCode!=''){
        $(".loader_sec").show();
            $.ajax({
                url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/ApplyDiscountGift',
                type : 'POST',
                dataType : 'JSON',
                headers : addDiscountHeaders,
                data : discount,
                async:false,
                success : function(data){
                    //debugger;
                    $(".loader_sec").hide();
                    if(data.ResultCode == 0){
                        $('.sub_total').html(data.SubTotal.toFixed(2));
                        $('.discount_Amt_Sec').removeClass('hide');
                        $('.discount_amt').html(data.DiscAmt.toFixed(2));
                        //$('.giftcards_amt').html(data.GCBal.toFixed(2));
                        $('.grandTotal,.cart_Price').html(data.Total.toFixed(2));
                        $('.coupon_code').val('');
                        if(data.Total==0){
                            $('#cashIn').val('0');
                            $('#cashValue').val('3');
                            placeOrder();
                        }                    
                        navigator.notification.alert(data.Message);
                    } 
                    else {
                        navigator.notification.alert(data.Message);
                    }
                },
                error : function(data){
                   // navigator.notification.alert('Some thing got wrong with discount')
                   // navigator.notification.alert('Discount transaction failed');
                   navigator.notification.alert(
                                  "Discount transaction failed",    // message
                                  null,       // callback
                                  "Please try again", // title
                                  'OK'        // buttonName
                              );

                }

            });
        } else {
            navigator.notification.alert('Please enter Discount Coupon Code');
        }
    }

     // start add discount
    $('.apply_gift_card').click(function(){
        //debugger;
        var cartId = localStorage.setItem('cartId','');
        var cartId = localStorage.getItem('cartId');
        if(cartId == '' || cartId == undefined){
            $.when(addtocart(cartDetails)).done(function(){
                cartId = localStorage.getItem('cartId');
                if(cartId!=''){
                    getgiftCoupon();                                       
                }
            });
        } else {
            getgiftCoupon();
        }        
    });

    var getgiftCoupon = function(){    
        // post parameters
        //
        //alert('gift')
        var giftcardCode = $('.coupon_code').val();
        discount = {
            CartID : localStorage.getItem("cartId"),
            CodeType : 2,
            Code : giftcardCode,
            Action : 1
        };
        // headers
        addDiscountHeaders = {
            DID   : localStorage.getItem("uuid"),//'14e5fabb-33a0-4812-a54d-1d0fe672fc41',
            TokenID :  window.token
        };
        if(giftcardCode!=''){
        $(".loader_sec").show();
            $.ajax({
                url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/ApplyDiscountGift',
                type : 'POST',
                dataType : 'JSON',
                headers : addDiscountHeaders,
                data : discount,
                success : function(data){
                    console.log('giftCard: '+data);
                    $(".loader_sec").hide();
                    if(data.ResultCode == 0){                   
                        $('.sub_total').html(data.SubTotal.toFixed(2));
                        $('.gift_bal').show();
                       // $('.discount_amt').html(data.DiscAmt.toFixed(2));
                        $('.giftAmntBalance').html(data.GCBal.toFixed(2));
                        $('.giftcards_amt').html(data.GCAmt.toFixed(2));
                        $('.grandTotal,.cart_Price').html(data.Total.toFixed(2));
                        $('.coupon_code').val('');
                        // if result amount is 0, complete the order

                        if(data.Total == 0){
                            localStorage.setItem('cashOut','0');
                            $('#cashValue').val('3');
                            navigator.notification.alert(data.Message);
                            //alert(data.Message);
                            placeOrder();
                        }
                    } else {
                        navigator.notification.alert(data.Message);
                    }
                },
                error : function(error){
                    // navigator.notification.alert('some problem occured on getting discount');
                    navigator.notification.alert(
                                  "Gift transaction failed",    // message
                                  null,       // callback
                                  "Please try again", // title
                                  'OK'        // buttonName
                              );
                }
            });
        } else {
            navigator.notification.alert('Please enter Gift Card Code');
        }
    }


// function to remove saved order itms

var removeSavedItm = function(savedOrderItm){

    //debugger; 
    //console.log('remove order id  = ' + removeItm);
    var removeItm = localStorage.getItem('removeOrderId');
    if(removeItm != "" && removeItm != null){
    // console.log('remove order id  = ' + removeItm);
 
    var _SavedOrders=JSON.parse(localStorage.getItem("SavedOrders"));
    //console.log('removeorders'+removeItm);
           
           var removeIndex = _SavedOrders.map(function(item) { return item.orderName;}).indexOf(removeItm);
            _SavedOrders.splice(removeIndex, 1);

      localStorage.setItem("SavedOrders",JSON.stringify(_SavedOrders));
  }
     // console.log('saveOrders'+_SavedOrders); 
}


//$('#credit_checkout').click(function(){
    //var $form = $(this).closest('.cash-section');
    $('.credit_section input').each(function(){
        $this = $(this);
        $this.blur(function(){
            if($this.val()!=''){
                $('#credit_checkout').removeAttr('disabled');
            }
        })

    });

    
//});
// function to detect ipad
function isiPhone(){
    return (
        //Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}

//var oflineObj = {};


    // to close the order
    $('.closeOrder').on('click', function(){
        //debugger;
        // var cartId = localStorage.setItem('cartId','');  
         var cartId = localStorage.getItem('cartId');
        $(".cart_units_count,.cart_price").html("");
             $(".productsTotal").hide();
             $(".empty_cart").show();
             $('.saveorder_btn,.cartsummary_btn,.table-number-box,.gift_bal').hide();
         //SaveOfflineOrders();
         //alert(localStorage.getItem('isDeviceOnline'));
         //SaveOfflineOrders();
         if(localStorage.getItem('isDeviceOnline')=='false'){
            //OflineOrderObj();
            SaveOfflineOrders();
            cartDetails = [];
            $('#cashIn').val("");
            detail_itms();
            print_me();
            $(".offlineOrders_sec").show();   
            $(".cart_units_count,.cart_price").html("");
             $(".productsTotal").hide();
             $(".empty_cart").show();


        } else {
             //$('#cashValue').val('3');
            //alert("cart id="+cartId);
            if(cartId == '' || cartId == undefined){
                $.when(addtocart(cartDetails)).done(function(){
                    var cartId = localStorage.getItem('cartId');
                    if(cartId!=''){
                        placeOrder();     
                        //cartId = localStorage.setItem('cartId','');               
                    }
                });
            } else {
                placeOrder();
            }
        }


    });
    var OflineOrderObj = function(){
    var offLineProds=[];
     $.each(cartDetails,function(key,val){
        offLineProds.push({'ProductId':val.ProductID,'Quantity':val.Quantity,'Price':val.unitPrice,'Total':val.price})
     });
    var oflineObj = {
        Products : offLineProds,
        DiscountType :localStorage.getItem('DiscountType'),
        Discount :  $('.discount_amt').html(),
        DiscountId : localStorage.getItem('DiscountID'),
        CodeType : 1,
        Code : $('.coupon_code').html(),
        OrderSubtotal: $('.sub_total').html(),
        Amount : $('.grandTotal').html(),
        cashValue : $('#cashValue').val(),
        PaymentMethod   : localStorage.getItem('payMethod'),
        cashIn          : $('#cashIn').val(),
        cashOut : parseFloat($('#cashOut').val()).toFixed(2),
        OfflineOrderId : 'OF-'+jQuery.now(),
        OfflineDateTime : new Date()//moment().format('DD-MM-YYYY h:mm a')
    };
    return oflineObj;
    
}
var SaveOfflineOrders=function(){
var db = window.sqlitePlugin.openDatabase("PosApp", "1.0", "Demo", -1);
var offlineOrderObj=OflineOrderObj();
 SaveIntoOfflineOrders(db,offlineOrderObj);
 getOfflineOrderCount(db);
 if(offlineOrderObj.PaymentMethod == '1'){
    navigator.notification.alert("Success Cash Out: $"+offlineOrderObj.cashOut);
 }
 $('#cashIn').val('');

     /*$('.home-icon-top').click();
     $(".cart_units_count,.cart_price").html("");
     $(".productsTotal").hide();
     $(".empty_cart").show();
     cartDetails=[];*/
 //SaveIntoOfflineOrderProduct(db,offlineOrderObj);
    
};
function SaveIntoOfflineOrders(db,offlineOrderObj){
db.transaction(function(tx) {
     tx.executeSql("INSERT INTO OfflineOrders (OfflineOrderId, OfflineJson) VALUES (?,?)",
                 [offlineOrderObj.OfflineOrderId,
                 JSON.stringify(offlineOrderObj),
                 ],
                  function(tx, res) {

                }, function(e) {
                  console.log("ERROR: " + e.message);
                });
          });
}
function getOfflineOrderCount(db){
    db.transaction(function(tx) {
    tx.executeSql('select *  from OfflineOrders',[],
                  OfflineOrdersCountCallback, 
                errorCB1//error callback               
                  );
    });
}
function OfflineOrdersCountCallback(tx,results){
     var offlineOrderCount=results.rows.length;
     localStorage.setItem('offlineOrderCount',offlineOrderCount)
     $('.offlineOrderCount').html(offlineOrderCount);
     cartDetails=[];
     $('.home-icon-top').click();
     $(".cart_units_count,.cart_price").html("");
     $(".productsTotal").hide();
     $(".empty_cart").show();
     
}
function SaveIntoOfflineOrderProduct(db,offlineOrderObj){
   // alert("inside SaveIntoOfflineOrderProduct");
db.transaction(function(tx) {
    $.each(offlineOrderObj.Products,function(key,val){
     tx.executeSql("INSERT INTO OfflineOrderProduct (OfflineOrderId, ProductID,Quantity,Price,Total) VALUES (?,?,?,?,?)",
                 [offlineOrderObj.OfflineOrderId,
                 val.ProductID,
                 val.Quantity,
                 val.unitPrice,
                 val.price,
                 ],
                  function(tx, res) {

                }, function(e) {
                  console.log("ERROR: " + e.message);
                });
          });
    });
}
    $(".numeric_sec input,.numeric").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    var validateCheckOut = function(cashValue){        
        // var CardNo = $('.CreditCardNo').val().length,
        //     month = $('.CardExpMonth').val(),
        //     year = $('.CardExpYear').val(),
        //     currentYear = new Date().getFullYear(),
        //     cashOut = $('#cashOut').val(),
        //     cvv = $('.CardCVV').val().length;

            //switch(cashValue){

            if(cashValue == 2){
            //    case 3:
                    if(CardNo <= 15 || CardNo >= 17){
                        navigator.notification.alert('Enter Correct Card No');
                        return false;
                    }
                    if(month > 12 || month < 1){
                        navigator.notification.alert('Month should be in between 1 and 12');
                        return false;
                    }
                    if(year < currentYear){
                        navigator.notification.alert('Enter correct expiry year');
                        return false;
                    }
                    if(cvv < 3){
                        navigator.notification.alert('CVV should be either 3 or 4');
                        return false;
                    }
                    return true;
                 //   break;
            }
            else if(cashValue == 1){
                //case 1:
                    if(cashOut==''){
                        navigator.notification.alert('Enter Cash');
                        return false
                    } 
                  //  break
            }
            //} 
        return cashValue;
    }




    var placeOrder = function(){

          //console.log('closeOrder Enter in to call');
$(".loader_sec").show();
        var cashValue = $('#cashValue').val(),
            amount = $('.grandTotal').html()

            
            //console.log('Started remove saved item');
        //removeSavedItm();
        // console.log('End remove saved item');

         
            //debugger;

        var CartID          = localStorage.getItem("cartId"),
            Amount          = $('.grandTotal').html(),
            PaymentMethod   = localStorage.getItem('payMethod'),
           
            cashIn          = $('#cashIn').val(),
            cashOut = parseFloat($('#cashOut').val()).toFixed(2)
            //break;


        if(PaymentMethod=='3'){
            data = {
                CartID          : CartID,
                Amount          : Amount,
                PaymentMethod   : PaymentMethod
            }
        } else {

            data = {
                CartID          : CartID,
                Amount          : Amount,
                PaymentMethod   : PaymentMethod,
               
                cashIn          : cashIn,
                cashOut         : cashOut,
                // fakedata        : new Date()
            };
        }
       // alert("CartID="+data.CartID+" "+"Amount="+data.Amount);
       // console.log('close order data'+data);

        closeOrderheaders = {
            DID     : localStorage.getItem("uuid"),//'14e5fabb-33a0-4812-a54d-1d0fe672fc41',            
            TokenID :  window.token
        }
        //console.log(validateCheckOut(cashValue));

        if(PaymentMethod=='1' && cashIn !='' || PaymentMethod=='3'){        
                $.ajax({
                    url         : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/PlaceOrder',
                    async       : true,
                    type        : 'POST',
                    dataType    : "JSON", 
                    headers     : closeOrderheaders,
                    data        : data,
                    success     : function(data){
                    // alert('success order');
                      // console.log('comleteOrder: '+data.Message);
                       // alert('comleteOrder: '+data.Message);
                        //console.log(data);
                        //debugger;
                        
                        localStorage.setItem('printOrderId',data.OrderId);
                        localStorage.setItem('Amount',data.Amount);
                        if(data.ResultCode == 0){
                        // debugger;
                            removeSavedItm();         
                            //$('#home').click();    
                            localStorage.removeItem("removeOrderId");  
                            
                            detail_itms();
                             print_me(); 
                            cartDetails = [];      
                            localStorage.setItem('cartId','');  
                            //localStorage.setItem('cashOut','');  

                            //$('.newOrder').click();
                            savedOrder = 'off';
                            $('.place-order-overlay input,.input_null,.home-product').val('');
                            $('.productsTotal').hide();
                            $('.empty_cart').show();
                            $('.saveorder_btn,.cartsummary_btn,.table-number-box,.gift_bal').hide();
                            $(".loader_sec").hide(); 
                            $('.cart_Price,.cart_units_count').html('');
                           savedOrders=[];
                          
                               
                              if(PaymentMethod == '1'){
                                //alert(data.Message+" Cash Out: $"+cashOut);    
                                navigator.notification.alert(data.Message+" Cash Out: $"+cashOut);          
                              } else {
                                navigator.notification.alert(data.Message);
                              }

                            $('.home-icon-top').click();
                           
$(".loader_sec").hide();
                             

                           // cartId = '';
                           // cartId = localStorage.setItem('cartId','');
                           // $('.cashMethod,.eftposMethod,.creditMethod').hide();
                           // $('#cash_checkout,#credit_checkout,#eftpos_checkout').attr('disabled','true');
                        } else {
                           navigator.notification.alert(data.Message);
                        }
                    },
                    error : function(data){
                        navigator.notification.alert(error);
                        //console.log('closeOrder: '+error);
                    }
                });
          
      } // end of validate funciton
        else {
            navigator.notification.alert('Enter amount');
        }

    }
$( document ).ready(function() {
    getOrdersCount();

});

    // start checkout_cart functionality

    var checkOut = function(){
        var obj = {};
        obj.url = "http://localhost/posapp/checkout.html";

        //obj.success = function(data){
        //loadCheckOutDetails(data)
        //}
    }

    var loadCheckOutDetails = function (data,price,savedOrderItm) {
        //debugger;
        //console.log($(data).find('.checkOut_Table tbody tr'))
        //$('.checkOut_Details_Sec').html('');
        //console.log(savedOrderItm);
        var tbody = $('.checkOut_Table').find('.checkOut_Details_Sec');
        var details = '';
        var CartDetails = data;//isReload ? cartDetails : JSON.parse(localStorage.getItem("checkOutOrderDetails"));
        $.each(CartDetails, function (key, val) {
            //console.log(val)
            if (!val.deleted && val.Quantity > 0) {
                details += '<tr class="checkOut_Products product_itm" id="' + val.ProductID + '">';
                details += '<td> <input type="checkbox" class="product_check"></td>';
                details += '<td class="checkOut_productName product_Name text-left">' + val.productName + '</td>';
                details += '<td class="checkOut_UnitPrice">$' + val.unitPrice + '</td>';
                details += '<td data-name="' + val.productName + '"><div class="text-center"><a href="javascript:" class="chekout-plus-icon"><img src="images/gray-plus-icon.png" class="addUnits changeItm" ></a>';
                details += '<input type="text" value="' + val.Quantity + '" class="checkOut_Cart_Qty cart-qty unitsQty checkOut_unitsQty" id="' + val.price.toFixed(2) + '" >';
                details += '<a href="javascript:" class="chekout-plus-icon"><img src="images/gray-minus-icon.png" class="removeUnits changeItm" ></a></div></td>';
                details += '<td width="150" >$<span class="checkOut_Total product_price">' + val.price.toFixed(2) + '</span></td>';
            }
        });
        $('#SubSlider1').hide();
        $('.checkout-wrapper').show();
        $('.grandTotal').text(price.toFixed(2));
        $('.checkOut_Details_Sec').html(details);
        $('.discount_amt').html('0.00');
        $('.giftcards_amt').html('0.00');
        $('.sub_total').text(price.toFixed(2));
        //$('.cart_units_count').html(data.);
        //debugger;

        // to redirect the user to the home page if the products length is 0
        if(!($('.checkOut_Products').length)){
            $('#home').click();
        }

    }

    deleteproducts = [];
    $(document).on('change','.product_check',function(){
        debugger;
        var deleteId =  $(this).closest('.product_itm').attr('id');
        if($(this).is(":checked")){
            //alert(deleteId);
            deleteproducts.push(deleteId);
        } else {
            //alert('not checked');
            //var removeItem = deleteId;
            deleteproducts = jQuery.grep(deleteproducts, function(value) {
                return value != deleteId;
            });
        }
        //addProduct(deleteproducts);
    });
    /*var DeleteSavedItem=function(){
     var removeOrderID=localStorage.getItem("removeOrderId");
     var _sOrders=JSON.parse(localStorage.getItem("SavedOrders");
     if(removeOrderID!="" && deleteproducts.length= ){
      var _item=$.grep(_sOrders,function(elem){
        return elem.orderName==removeOrderID;
      });

     }

    };*/

    $('.product_Delete').click(function(){
        // debugger;
       localStorage.setItem("cartId",'');
        //DeleteSavedItem();
        var CartDetails = cartDetails.length>0 ?  cartDetails : temp() ;
  

        for(i=0;i<deleteproducts.length;i++) {
            //$('tr#' + deleteproducts[i]).remove();
            for (j = 0; j < CartDetails.length; j++) {
                //console.log(cartDetails[i].productId);
                //console.log(deleteproducts[i]);
                if (CartDetails[j].ProductID == deleteproducts[i]) {
                    CartDetails[j].deleted = true;
                    //$('.product_Delete').click();
                    updateProductQuantity(CartDetails);
                    //break; //Stop this loop, we found it!
                }
            }
        }
            //product=JSON.parse(localStorage.getItem("checkOutOrderDetails"));
        loadCheckOutDetails(CartDetails,getProductPrice(CartDetails));



    });
var updateSavedLocalStorage=function(removeItem){
    //debugger;
    var savedItems=JSON.parse(localStorage.getItem("SavedOrders"));
    var child=[];
    $.each(savedItems,function(key,val){
    if(val.orderName==removeItem)
        {
            for(var i=0;i<=deleteproducts.length;i++){
             $.grep(val.selectedItems, function(e){ 
                if( e.ProductID == deleteproducts[i]){
                e.deleted=true;

                }

                 });
           
            }
        }
    });

        console.log(savedItems);
        localStorage.setItem("SavedOrders",JSON.stringify(savedItems));

}
var temp=function(){
  
       var parent=[];
       var child=[];
        var x= JSON.parse(localStorage.getItem("SavedOrders"));
        var removeItm = localStorage.getItem('removeOrderId');
        updateSavedLocalStorage(removeItm);
        $.each(x,function(key,val){
             if(val.orderName==removeItm){
                parent.push(val);
             }

        });
        for(var i=0;i<parent.length;i++){
          for(var j=0;j<parent[i].selectedItems.length;j++){
            console.log(parent[i].selectedItems[j]);
           child.push(parent[i].selectedItems[j]);

          }

        }
        
   return child;

}   
var InsertOrUpdateSavedOrder=function(updatedCart){
var removeOrderID=localStorage.getItem("removeOrderId");
var savedOrderItems=JSON.parse(localStorage.getItem("SavedOrders"));
 if(removeOrderID!=""){
    $.each(savedOrderItems,function(key,val){
      if(val.orderName==removeOrderID){
       //val.selectedItems.push(updatedCart);
      }

    });
 }else{
    generateSavedOrders();
 }
};

// start newOrder



// save order button click
$('.saveorder_btn').click(function (index) {  
    var savedOderId = $('#tableName').val();

    //if(saveorderStatus == 'false'){
        if(savedOderId != '' || savedOrder == 'on'){
            if(preventDublicateOrdeOnSave(savedOderId)){
                generateSavedOrders(savedOderId);
                cartDetails=[];
                $('#home').click();
                $('.addtocart_btn,.productsTotal ').hide();
                $('.saveorder_btn,.cartsummary_btn,.table-number-box').hide();
                $('.home-product,#tableName').val('');
                $('.empty_cart').show();
                savedOrder = 'off';

              // saveorderStatus = 'true';
             }
        } else {
            navigator.notification.alert('Please Provide an Id');
        }
    //}
        //InsertOrUpdateSavedOrder(cartDetails);
        

    });
    var savedOrders = [];

    var order = jQuery.now();

 var updateSavedLocalStorage1=function(){
    var _savedOrders=JSON.parse(localStorage.getItem('SavedOrders'));
    if(cartDetails.length>0){
            $.each(_savedOrders,function(key,val){
                if(val.orderName==localStorage.getItem('removeOrderId')){
                    _savedOrders[key].selectedItems=cartDetails;
                }
            });
            localStorage.setItem('SavedOrders',JSON.stringify(_savedOrders));
        }
 }
  var preventDublicateOrdeOnSave=function(_orderName){
   var _savedOrders=JSON.parse(localStorage.getItem('SavedOrders'));
    if(_savedOrders !=null && _savedOrders !=''){    
         var obj=$.grep(_savedOrders,function(key){
        return key.orderName==_orderName;
         });
         if(obj.length>0){
            navigator.notification.alert("Table ID already Exists");
            $('#tableName').val('');
          return false;
         }
    }
     return true;

  }

    var generateSavedOrders = function (index,value) {
//debugger;
        var tableName = $('#tableName').val();
       
        if(tableName==''){
            orderName = jQuery.now();
        } else {
            orderName = tableName;
        }

        if(localStorage.getItem('removeOrderId')!="" && localStorage.getItem('removeOrderId')!=null){
            updateSavedLocalStorage1();
        }else{

        var order = {
            'orderName': orderName,
            'selectedItems': cartDetails,
            'orderTotal': function () {
                var total=0;
                $.each(this.selectedItems, function (key, value) {
                    total+=value.price;
                });
                return total; 
            }
        };
        savedOrders.push(order);
        localStorage.setItem("SavedOrders",JSON.stringify(savedOrders));
        //console.log(savedOrders);
        $('#tableName').val('');
    }
    };

    // btnorder click function

 $(document).on("click ", '.btnOrder', function (elem) {
   // debugger;
   savedOrder = 'on';
        cartDetails=[];
        var order=$(this);
        var savedOrderItm=$(order).attr('data-ordername');
        $('.table-number-box').hide();
        var selectedItems=[];
        var total=0;
        var _SavedOrders=JSON.parse(localStorage.getItem("SavedOrders"));
        var removeSavedOrders = localStorage.setItem('removeOrderId',savedOrderItm);
       // console.log(_SavedOrders);
        $.each(_SavedOrders,function(key,val){
            if(val.orderName==savedOrderItm){
                selectedItems=val.selectedItems;
                total=getProductPrice(val.selectedItems);
                cartDetails = selectedItems;
            }
        });
        loadCheckOutDetails(selectedItems,total,savedOrderItm);
        updateProductQuantity(selectedItems);
       // cartDetails = localStorage.
       //console.log(selectedItems);
        $('.addtocart_btn').hide();
    });

// render saved orders

var renderSavedOrders = function(data){
        //debugger;
        //var renderOrders =  generateSavedOrders();
       // var ordersChild='';
       //debugger;
        var ordersParent = '';
        var savedOrders=JSON.parse(localStorage.getItem("SavedOrders"));
        $.each(savedOrders, function (key, val) {
            //ordersParent+='<button class="btn no-radius"><img src="dist/images/itemadded-cart-icon.png">' + renderOrdersChild(renderOrders) + '</button>';
            ordersParent += '<button class="btn no-radius btnOrder height156" data-orderName="'+val.orderName +'">';
            ordersParent += '<img src="images/itemadded-cart-icon.png">';
            ordersParent += '<h4 class="mar-t10">Cart ID: <span >'+val.orderName+'</span></h4>';
            ordersParent += '<h4>Amount: $<span>'+getProductPrice(val.selectedItems).toFixed(2)+'</span></h4></button>';
        });

        //console.log(ordersChild);
        return ordersParent;
    }

    // get product price
    var getProductPrice=function(data){
        var total=0;
        $.each(data,function(key,val){
            if (!val.deleted)
            {
            total+=val.price;
            }
        });
        return total;


    }


$(document).on('click','.home-icon-top',function () {
        //debugger;
        //console.log(savedOrders);
       // $.ajax({
          //  url: 'home1.html',
           // success: function (data) {
             //   $('.home-content').html(data);
             //debugger;
                //cartDetails = [];
                $('.home-content').show();
                $('.get-passcode,#SubSlider').hide();
                $('.slider,.breadcrumb').show();
                // var db = window.sqlitePlugin.openDatabase("PosApp", "1.0", "Demo", -1);
                // getOfflineOrderCount(db);

                if(parseInt(localStorage.getItem("offlineOrderCount"))>=1){
                  $('.offlineOrders_sec').show();
                  $('.offlineOrderCount').html(localStorage.getItem('offlineOrderCount'));
                }else{
                  //localStorage.setItem("offlineOrderCount",0);
                  $('.offlineOrders_sec').hide();
                }
                
                //localStorage.setItem('removeOrderId','');
                deleteproducts=[];
                if(localStorage.getItem("isDeviceOnline")=='true' && localStorage.getItem("isOffline")=='false')
                {
                $('.refund_sec').show();
                }
                $('.get-web-orders').hide();

                //$('.checkOut_Details_Sec').html('');
                //$('.saveorder_btn,.cartsummary_btn,.table-number-box').hide();
                //localStorage.setItem("cartId",'');
                //$('.cart_units_count,.cart_Price').html('');
                //localStorage.setItem('removeOrderId','');
                var orders = renderSavedOrders(savedOrders);
                $('.savedOrders_sec').html(orders);
               // $(document).find('input').val('');
                //$(document).find('input:radio').removeAttr('checked');
                //$('.cart_Price,.cart_units_count').html('');
            //}
       // });
    //    //var orders = generateSavedOrders();

    });

// start new order
$('.newOrder_btn').click(function(){
  renderSubCategories(1,'Take Home Meals');
});


// refund order btn

$('.refund_btn').click(function(){
    //debugger;
    $(".loader_sec").show();
    data = {
        OrderID : $('.refund_OrderID').val(),
        Amount  : $('.refund_OrderCash').val(),
        Reason  : $('.refund_Reason').val()
    }
    if(data.OrderID != '' && data.Amount !=''){
        $.ajax({
            url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/ProcessRefund',
            headers : headerParams,
            data : data,
            type : 'POST',
            success : function(data){               
               $(".loader_sec").hide();  
               if(data.ResultCode == 0){
                        navigator.notification.alert('Refunded Amount: $'+data.RefundAmount.toFixed(2));
                        $('.refund_sec input').val('');

                } else {
                    navigator.notification.alert(data.Message);
                    //$('.refund_sec input').val('');
                }

            },
            error : function(error){
                // navigator.notification.alert('Some error occured on refunding')
                navigator.notification.alert(
                              "Refund transaction failed",    // message
                              null,       // callback
                              "Please try again", // title
                              'OK'        // buttonName
                          );
            }
        });
    } else {
        $(".loader_sec").hide(); 
        navigator.notification.alert('Please fill the Refund Order details');
    }

});




        $(function(){
          var hgt = $(window).height();
          $(".loader_sec").css({'height':hgt});         
        });

print_itm ='';

var detail_itms = function(){
    var date = new Date(),    
        getMonth = date.getMonth(),
        getDate = date.getDate(),
        getYear = date.getFullYear(),
        printDate = getMonth+' '+getDate+','+getYear,
        printTime = date.getHours() + ":" + date.getMinutes(),
        printAmount = parseFloat(localStorage.getItem('Amount')).toFixed(2)


        var printProducts = JSON.parse(localStorage.getItem('printProducts'));
        //var itemHtml=print_Products(printProducts.Products);
var convertDecimal = function(items){
        $.each(items,function(key,val){
            val.price = val.price.toFixed(2);
        })
        return items;
    }

    var print_obj = {
        companyName : localStorage.getItem('Company'),
        ABNCode : localStorage.getItem('BusinessNumber'),
        printDate : printDate,
        printTime : printTime,
        print_OrderID : localStorage.getItem('printOrderId'),
        print_paymentMethod : localStorage.getItem('PaymentMethod'),
        printAmount : '$'+printAmount,      
        discount : $('.discount_amt').html() !='' ? '$'+$('.discount_amt').html() : '$0.00' ,
        gidtCard : $('.giftAmntBalance').html() !='' ? '$'+$('.giftAmntBalance').html() : '$0.00',
        items : convertDecimal(printProducts.Products),
        printSubTotal : '$'+$('.sub_total').html()  

    }


       // printdetails(print_obj)
        print_itm = JSON.stringify(print_obj);
}
// console.log(print_itm);

// get orders service call





$('.getOrders').click(function(){
    $('.order-details tbody td,.webOrder_Total').html('');
    $('.amount_refunded').html('');
    // $.when(getOrders()).done(function(){
    //     $('.get-web-orders').show();
    // });
    getOrders();
    $('.get-web-orders').show();
    $('.checkout-wrapper,.get-passcode,.home-content,#SubSlider').hide();

});


var getOrdersCount = function(){
    $('.loader_sec').hide();
    var data = {
        OrderId : '',
        MarkAsComplete : false
    }
    $.ajax({
        url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : data,
        type : 'POST',
        success : function(data){
            //debugger;
            var result = data.ResultCode;
            if(result == 0){
                var orderCount = data.OrderCount;
                if(orderCount>0){   
                    $('.webOrderscount').html(orderCount).show();  
                }
            } else {
                //navigator.notification.alert(data.Message)
            }
        },
        error : function(data){
            //navigator.notification.alert(data.Message);
        }
    });
}


var getOrders = function(){
    $(".loader_sec").show();    
    var data = {
        OrderId : '',
        MarkAsComplete : false
    }
    $.ajax({
        url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : data,
        type : 'POST',
        success : function(data){
            var result = data.ResultCode;
            $(".loader_sec").hide();
            if(result == 0){
                $('#SubSlider,.refund_sec').hide();
                var orderCount = data.OrderCount,
                    orders = data.Orders,
                    ordersCount = data.OrderCount;
                   // $('.get-web-orders').show();
                if(ordersCount > 0){    
                    $('.webOrderscount').html(ordersCount);   
                    orderList(orders); // generate the order list
                    generateGetOrders(orders);
                    orderDetails(orders);    
                    $('.webOrderscount').show();
                    $('#home_sec').siblings().remove().end().parent().append($('<span>Web Orders</span>'));
                } else {
                    // $('.order_details_sec tbody').html('There are no Web Orders') 
                    // navigator.notification.alert('There are no Web Orders')
                }
            } else {
                // navigator.notification.alert(data.Message)
            }
        },
        error : function(data){
            navigator.notification.alert(data.Message);
        }
    });
}

// fetch specific order

$('.get_WebOrder').click(function(){
    var OrderId = $('#webOrder_number').val();
    if(OrderId !=""){
        getSpecificWebOrder(OrderId);
    }
});
$('#webOrder_number').keypress(function(e){
    if(e.which == 13){//Enter key pressed
        var OrderId = $(this).val();
        getSpecificWebOrder(OrderId);
    }
});
var getSpecificWebOrder = function(OrderId){
     $(".loader_sec").show();        
    // debugger;
    var params = {
        OrderId : OrderId,
        // MarkAsComplete : true
    }
    $.ajax({
        url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : params,
        type : 'POST',
        success : function(data){

            $(".loader_sec").hide(); 
            var result = data.ResultCode;
            if(result == 0){
                var orders = data.Orders;
                orderDetails(orders);
                generateGetOrders(orders);
                $('#webOrder_number').val('').blur();
            } else {
                navigator.notification.alert(data.Message)
            }
        },
        error : function(data){
            navigator.notification.alert(data.Message);
        }
    });  

}

// generate list
var orderList = function(orders){
    var ordersList = '';
    for(i=0;i<orders.length;i++){
        ordersList += '<li id="weborder_'+orders[i].OrderId+'" class="weborderList"><a href="javascript:">'+ orders[i].OrderId +'</a></li>';
    }  
    $('.orders-list').html(ordersList);

}

// order_list li
$(document).on('click', '.weborderList', function(){    
    var OrderId = this.id.split('_')[1];
    getSpecificWebOrder(OrderId);
})
// order details
var orderDetails = function(orders){
    var webOrder_id = orders[0].OrderId;
    var webOrder_status = orders[0].OrderStatus;
    var webOrder_Cinfo = orders[0].CustomerInfo;
    var webOrder_Cmob = orders[0].CustomerMobile;
    var weborder_total = orders[0].OrderTotal;
    switch(webOrder_status){
        case 10:
         $('.webOrder_status').html("Pending");
         $('.mark_Completed').show();
         break;
        case 20:
         $('.webOrder_status').html("Processing");
         $('.mark_Completed').show();
         break;
        case 30:
         $('.webOrder_status').html("Complete");
         $('.mark_Completed').hide();
         break;
        case 40:
         $('.webOrder_status').html("Cancelled");
         $('.mark_Completed').hide();
         break;
    }
    $('.webOrder_id').html(webOrder_id);
    $('.webOrder_Cinfo').html(webOrder_Cinfo);
    $('.webOrder_Cmob').html(webOrder_Cmob);
    $('.webOrder_Total').html(weborder_total.toFixed(2));
}

// generate get orders
var generateGetOrders = function(orders){
    var itemList = orders[0].OrderItems;
    var items = '';
    var orderTotal = orders[0].OrderTotal;
    var refunded_amnt = orders[0].RefundedAmount;
    for(i=0;i<itemList.length;i++){
        items += '<tr><td>'+itemList[i].ProductName+'</td>';
        items += '<td>'+itemList[i].Quantity+'</td></tr>';
    }
    $('.order_details_sec tbody').html(items);
    $('.amount_refunded').html(refunded_amnt.toFixed(2));
}

$('.mark_Completed').click(function(){
    mark_complete();
})

// mark complete function

var mark_complete = function(params){
    // debugger;
    $(".loader_sec").show(); 
    var OrderId = $('.webOrder_id').html();
    var params = {
        OrderId : OrderId,
        MarkAsComplete : true
    }
    $.ajax({
        url : 'http://point-of-sale.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : params,
        type : 'POST',
        success : function(data){
            $(".loader_sec").hide(); 
            var result = data.ResultCode;
            if(result == 0){
                getOrders();
                var len = $('.weborderList').length;
                if(len == 1){
                    $('.orders-list,.webOrderscount').html('');
                    $('.order-details td,.webOrder_Total,.amount_refunded').html('');
                }
                $('.orders-list li#'+OrderId).remove();
            } else {
                navigator.notification.alert(data.Message)
            }
        },
        error : function(data){
            navigator.notification.alert(data.Message);
        }
    });    
}

// Enable passcode section
    $('.settings-icon').click(function(){
        $('.home-content,.get-web-orders,#SubSlider,.checkout-wrapper').hide();
        $('.get-passcode').show();
        // $('.breadcrumb').hide();
    });
    
// $('.currPasscode').blur(function(){
//     var oldPasscode = localStorage.getItem('updatedPasscode');
//     var $this = $(this),
//      $curr = $this.closest('.passcode_chk').find('input');
//         $curr.each(function(){
//             currPassCode.push($(this).val());
//         });
    
//     currPassCode = currPassCode.join('');
//     if(passcodeUpdated == true){
//        if(oldPasscode != currPassCode){
//         alert('Enter New Passcode');
//         $curr.val('');
//        }
//     }
//        currPassCode = [];
// });
    // $('.passcode_chk').find('input').on('keyup',function(e){
    //               var $len = $(this).val()q.length;
    //               if($len>1){
    //                 e.preventDefault();
    //               }

    // });

$('.passcode_chk').find('input').on('keyup',function(e){
    var boxVal = [];
    var val1=$(this).val();
    if(val1.length>1){  
      
        boxVal=$(this).val();        
        var firstvalue = boxVal[0];
        $(this).val(firstvalue);
    }
    
});
    // newPassCode = [];
    // NPassCode = '';
    // CPassCode = '';
    // $('.newpasscode_first,.confirmPasscode_first').focus(function(){
    //     $('.oldPasscode_chk').find('input').each(function(){
    //         var $this = $(this);
    //         if($this.val() == ''){
    //          $this.focus()   
    //         }
    //     });
    // });
    // $('.newPassCode').on('blur',function(){
    //     var $this = $(this),
    //         $curr = $this.closest('.passcode_chk').find('input');
    //     $curr.each(function(){
    //         newPassCode.push($(this).val());
    //     });
    //    NPassCode = newPassCode.join('');
    //    newPassCode = [];
    //    var oldPasscode = localStorage.getItem('updatedPasscode');
    //    if(oldPasscode == NPassCode){
    //     alert('Enter New Passcode');
    //     $curr.val('').focus();
    //    }
       
    // });
    
    // confirmPassCode = [];
    // $('.confirmPassCode').on('keydown',function(){
    //     var $this = $(this),
    //         $curr = $this.closest('.passcode_chk').find('input');
    //     $curr.each(function(){
    //         confirmPassCode.push($(this).val());
    //     });
    //     CPassCode = confirmPassCode.join('');
    //      if(CPassCode != NPassCode){
    //         alert('Passcode does not match');
    //         $curr.val('').focus();
    //     }   
    //     confirmPassCode = [];
    // });
currPassCode = [];
confirmPassCode = [];
newPassCode = [];
NPassCode = '';
CPassCode = '';
passcodeUpdated = '';

    $('.updatePasscode').click(function(){
        // localStorage.setItem('updatedPasscode','1234');

        var oldPasscode = localStorage.getItem('updatedPasscode');
            currPassCode = [];
             $curr = $('.oldPasscode_chk').find('input');
                $curr.each(function(){
                    currPassCode.push($(this).val());
                });
            currPassCode = currPassCode.join('');
            //if(passcodeUpdated == true){
               if(oldPasscode != currPassCode){
                navigator.notification.alert('Enter your current Passcode');
                $curr.val('').eq(0).focus();
               }
            //}
               $newp = $('.newpasscode_chk').find('input');
                $newp.each(function(){
                    newPassCode.push($(this).val());
                });
               NPassCode = newPassCode.join('');
               
               var oldPasscode = localStorage.getItem('updatedPasscode');
               if(oldPasscode == NPassCode || NPassCode == ''){
                navigator.notification.alert('Enter New Passcode');
                if(currPassCode!=''){
                    $newp.val('').eq(0).focus();
                }
               }

               $cpass = $('.confrimpasscode_chk').find('input');
                $cpass.each(function(){
                    confirmPassCode.push($(this).val());
                });
                CPassCode = confirmPassCode.join('');
                 if(CPassCode != NPassCode){
                    navigator.notification.alert('Passcode does not match');
                    if(currPassCode!='' && NPassCode !=""){
                        $cpass.val('').eq(0).focus();
                    }
                }  
                
                if(CPassCode!='' && NPassCode !='' && CPassCode == NPassCode && oldPasscode == currPassCode && oldPasscode!=null){
                    debugger;
                    localStorage.setItem('updatedPasscode',CPassCode);

                    passcodeUpdated = true;
                    navigator.notification.alert('Passcode Updated Successfully');
                    localStorage.setItem('passcodeUpdated','true');
                    $(".get-passcode input").val("");
                }

               currPassCode = [];
               confirmPassCode = [];
               newPassCode = [];



        
    }); // end of update passcode functionality






var interval = null;

//jQuery(function(){
    
  interval = setInterval(
    function(){
       if(localStorage.getItem("isDeviceOnline")="true")
       {
           getOrdersCount();  

           // navigator.notification.alert('weborders');
       } 

    }//getOrdersCount
    , 600000);
//});




});
// convert html into images

// print details




