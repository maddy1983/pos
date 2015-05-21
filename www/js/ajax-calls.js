/**
 * Created by Madhu on 2/7/2015.
 */

 
    var listUrl = "http://localhost/products/js/products.json";
    app = {};
    //var listUrl = "http://demo.gtsinteractive.com/GTSIPOSWS/ProductList";
    // this is for loading main categories
     
        $.ajax({
            url : listUrl,
            headers: {
                'DID':'14e5fabb-33a0-4812-a54d-1d0fe672fc41',
                'TokenID': token
            },
            dataType : 'json',
            success : function(data) {
                app = data;
                var categories = data.Data.Categories;
                var ResultCode = data.Data.ResultCode;
                var categories_sec = '';
                if(ResultCode === 0) {
                    $.each(categories, function (listIndex, list) {
                        if (list.IsActive === 1 && list.ParentCategoryID === 0) {
                            categories_sec += "<li class='categories text-center pull-left' id='" + list.CategoryID + "'><a>";
                            categories_sec += "<img src='" + list.ImagePath + "' class='images_list'><br/>";
                            categories_sec += "<span>" + list.CategoryName + "</span>";
                            categories_sec += "</a></li>";
                            $('#categories').html(categories_sec);
                        }
                    });
                }
                else if (data.ResultCode === 1) {
                    alert('DID not allowed');


                } else if (data.ResultCode === 2) {
                    alert('Token is invalid or has expired');

                } else if (data.ResultCode === 3) {
                    alert('Invalid LastSyncTime format');

                }
            },
            error : function(data){
              alert('Failed to load products');
            }
        });
   
    // sorting

    // get the list of categories
    var getCategories = function(itemId) {       
        $('#subCategories_sec').hide().animate({top:1200},400);
        var subCategories_sec = '';
            $.each(app.Data.Categories, function (key,val) {
                if (val.ParentCategoryID.toString() === itemId) {
                    subCategories_sec += "<li class='subCategories text-center pull-left' id='" + val.CategoryID + "'><a>";
                    subCategories_sec += "<img src='" + val.ImagePath + "' class='images_list'><br/>";
                    subCategories_sec += "<span>" + val.CategoryName + "</span>";
                    subCategories_sec += "</a></li>";
                    $('#subCategories').html(subCategories_sec);
                    $('#productsList_sec').hide();
                    $('#subCategories_sec').show().animate({top:250},400);
                }
            })
        /*});*/
    }
    var getProductList = function(itemId) {    	 
        var productsList_sec = '';
        $.getJSON(listUrl, function (data) {
            var products = data.Data.Products;
            $.each(products, function (listIndex, list) {
                if (list.CategoryID.toString() === itemId) {
                    productsList_sec += "<li class='products text-center pull-left ptn_rel' id='" + list.ProductID + "'><a>";
                    productsList_sec += "<img src='" + list.ImagePath + "' class='images_list'><br/>";
                    productsList_sec += "<span>" + list.ProductName + "</span><br/>";
                    productsList_sec += "<p class='clearfix productUnits' id='" + list.Price + "'><span class='btn btn-primary pull-left addProductUnit productItemsBtn'>+</span>";
                    productsList_sec += "<span class='unitsCount col-sm-8 row text-center pull-left'>1</span>";
                    productsList_sec += "<span class='btn btn-primary pull-right removeProductUnit productItemsBtn'>-</span></p>";
                    productsList_sec += "<p class='clearfix'>$<span class='productPrice'>"+list.Price+"</span>";
                    productsList_sec += "<span class='btn btn-primary addToCart' id='product_" + list.ProductID + "'>Add to Cart</span></p>";
                    productsList_sec += "</a></li>";
                    $('#productsList').html(productsList_sec);
                    $('#subCategories_sec').hide();
                    $('#productsList_sec').show();
                }
            })
        });
    }
    $(document).on("click",".item-list li",function(){
        var itemId = this.id,
            section = $(this).parent().attr('id');
        if(section === 'categories')
            getCategories(itemId);
        else {
            getProductList(itemId);
            $.getScript("js/products.js");
        }
    })
 