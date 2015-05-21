var interval = null;

jQuery(function(){
  interval = setInterval(getOrdersCount, 600000);
});


$('.getOrders').click(function(){
    $('.order-details tbody td,.webOrder_Total').html('');
    // $.when(getOrders()).done(function(){
    //     $('.get-web-orders').show();
    // });
    getOrders();
    $('.get-web-orders').show();
    $('.checkout-wrapper').hide();

});


var getOrdersCount = function(){
    $('.loader_sec').hide();
    var data = {
        OrderId : '',
        MarkAsComplete : false
    }
    $.ajax({
        url : 'http://demo.gtsinteractive.com/GTSIPOSWS/GetOrder',
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
                navigator.notification.alert(data.Message)
            }
        },
        error : function(data){
            navigator.notification.alert(data.Message);
        }
    });
}


var getOrders = function(){
    var data = {
        OrderId : '',
        MarkAsComplete : false
    }
    $.ajax({
        url : 'http://demo.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : data,
        type : 'POST',
        success : function(data){
            var result = data.ResultCode;
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
                navigator.notification.alert(data.Message)
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
    getSpecificWebOrder(OrderId);
});
$('#webOrder_number').keypress(function(e){
    if(e.which == 13){//Enter key pressed
        var OrderId = $(this).val();
        getSpecificWebOrder(OrderId);
    }
});
var getSpecificWebOrder = function(OrderId){
    // debugger;
    var params = {
        OrderId : OrderId,
        // MarkAsComplete : true
    }
    $.ajax({
        url : 'http://demo.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : params,
        type : 'POST',
        success : function(data){
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
    var OrderId = $('.webOrder_id').html();
    var params = {
        OrderId : OrderId,
        MarkAsComplete : true
    }
    $.ajax({
        url : 'http://demo.gtsinteractive.com/GTSIPOSWS/GetOrder',
        headers : headerParams,
        data : params,
        type : 'POST',
        success : function(data){
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