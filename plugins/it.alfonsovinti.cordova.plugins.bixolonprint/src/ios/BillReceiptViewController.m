//
//  BillReceiptViewController.m
//  POS
//
//  Created by ScriptLanes on 28/07/14.
//
//

#import "BillReceiptViewController.h"
#import "BillReceiptTableViewCell.h"
#import "CDVBixolonPrint.h"
//#import "DataAccessor.h"
//#import "AppDelegate.h"
//#import "User.h"
//#import "ViewController.h"
//#import "NewOrders.h"
// #import "CoreData+MagicalRecord.h"

@interface BillReceiptViewController ()
{
//    DataAccessor *dataAC;
    NSMutableArray *dataArray;
    //AppDelegate *appDel;
    NSString* currencySymbol;
    CDVBixolonPrint *bixolonPrintobj;
}
@property(nonatomic,retain)NSString* currencySymbol;

@end

@implementation BillReceiptViewController
@synthesize currencySymbol,lblsubtotal;
@synthesize BillDate,billNo,billTableView,billTime,paymentType,VisitAgainView,responseDictionary,totalAmount;
@synthesize paymentOption;
//madhu code
@synthesize lblGiftCard;
@synthesize lblDiscount;
@synthesize lblABNCode;
@synthesize lblCompanyName;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
//        dataAC = [DataAccessor sharedDataAccessor];
        dataArray = [[NSMutableArray alloc] init];
        responseDictionary = [[NSDictionary alloc] init];
        paymentOption = [[NSString alloc] init];
      //  appDel = (AppDelegate *)[[UIApplication sharedApplication]delegate];
        bixolonPrintobj=[[CDVBixolonPrint alloc] init];



    }
    return self;
}
-(void)setTheView
{
//    if ([dataAC.activeOrderId isEqualToString:@""])
//    {
//        dataArray = [dataAC getProductList];
//    }
//    else
//    {
//        dataArray = [dataAC getActiveOrderProductDetails];
//        
//    }
    NSString *currencyCode = @"USD";
    NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:currencyCode];
    self.currencySymbol = [NSString stringWithFormat:@"%@",[locale displayNameForKey:NSLocaleCurrencySymbol value:currencyCode]];
    NSLog(@"Currency Symbol : %@", currencySymbol);
    
    NSLog(@"responseDictionary:(%@)",responseDictionary);
    
    if ([[responseDictionary valueForKey:@"items"] isKindOfClass:[NSArray class]]) {
        dataArray = [responseDictionary valueForKey:@"items"];
    }
       CGFloat tableViewHeight = [dataArray count] * 64;
    billTableView.frame = CGRectMake(billTableView.frame.origin.x, billTableView.frame.origin.y, billTableView.frame.size.width, tableViewHeight);

    

       [self formatTheView];
    UIImage *image = [self captureView:self.view];
    NSData *pngData = UIImagePNGRepresentation(image);
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsPath = [paths objectAtIndex:0]; //Get the docs directory
    NSString *filePath = [documentsPath stringByAppendingPathComponent:@"BillReceipt.png"]; //Add the file name
    [pngData writeToFile:filePath atomically:YES]; //Write the file
    [self printImage];
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
    
}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 64.0;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [dataArray count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    static NSString *CellIdentifier = @"Cell";
    BillReceiptTableViewCell *cell = (BillReceiptTableViewCell *)[tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"BillReceiptTableViewCell" owner:self options:nil];
        cell = (BillReceiptTableViewCell *)[nib objectAtIndex:0];
        cell.backgroundColor  = [UIColor clearColor];
        
    }
//    ProductDetails *productObject = [dataArray objectAtIndex:indexPath.row];
//    if ([productObject.isDeletedItem isEqual:[NSNumber numberWithBool:NO]])
//    {
//        float price = [productObject.quantity intValue] * [productObject.productPrice floatValue];
//        //cell.serialNO.text = [NSString stringWithFormat:@"%d",indexPath.row + 1];
    NSDictionary* dicTemp = [dataArray objectAtIndex:indexPath.row];
    
    cell.itemName.text = [NSString stringWithFormat:@"%@",[dicTemp valueForKey:@"productName"]];
    cell.quantity.text = [NSString stringWithFormat:@"%@",[dicTemp valueForKey:@"Quantity"]];
    cell.rate.text = [NSString stringWithFormat:@"%@%@",self.currencySymbol,[dicTemp valueForKey:@"unitPrice"]];
    cell.value.text = [NSString stringWithFormat:@"%@%@",self.currencySymbol,[dicTemp valueForKey:@"price"]];
//
//    }

    return cell;
}


-(void)formatTheView
{
    
    CGFloat height = [dataArray count] * 64+20;
    CGRect frame = self.view.frame;
    frame.size.height = frame.size.height + height;
    self.view.frame = frame;
    
    CGFloat viewHeight = self.view.frame.size.height;
    CGRect subViewFrame = VisitAgainView.frame;
    subViewFrame.origin.y = viewHeight;
    VisitAgainView.frame = CGRectMake(0, viewHeight, self.VisitAgainView.frame.size.width, self.VisitAgainView.frame.size.height);
    [self.view addSubview:VisitAgainView];
    self.view.frame = CGRectMake(0, 0, self.view.frame.size.width, viewHeight+350);
    [self setlabels];
    
}

-(void)setlabels
{
    
    NSTimeZone *timeZone = [NSTimeZone defaultTimeZone];
    NSDate *date = [NSDate date];
    NSDateFormatter *dateFormator = [[NSDateFormatter alloc] init];
    dateFormator.timeZone = timeZone;
    [dateFormator setDateFormat:@"HH:mm"];
    NSString *time = [dateFormator stringFromDate:date];
    NSDateFormatter *dateFormator1 = [[NSDateFormatter alloc] init];
    dateFormator1.timeZone = timeZone;
    [dateFormator1 setDateFormat:@"MMM dd,yyyy"];
    NSString *dateString = [dateFormator1 stringFromDate:date];
    NSLog(@"LastSyncDateTime : %@ %@",time ,dateString);
    BillDate.text = dateString;
    billTime.text = time;
    
    //Madhu wrote :
    lblABNCode.text = [NSString stringWithFormat:@"ABN : %@",[responseDictionary valueForKey:@"ABNCode"]];
    lblCompanyName.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"companyName"]];
//currencySymbol
    lblDiscount.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"discount"]];
    
    lblGiftCard.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"gidtCard"]];

    paymentType.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"print_paymentMethod"]];
    
    totalAmount.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"printAmount"]];
    
    lblsubtotal.text = [NSString stringWithFormat:@"%@",[responseDictionary valueForKey:@"printSubTotal"]];
    billNo.text = [NSString stringWithFormat:@"%@",[responseDictionary objectForKey:@"print_OrderID"]] ;
  
}
- (UIImage *)captureView:(UIView *)view {
    
    CGRect screenRect =  view.frame;
    UIGraphicsBeginImageContext(screenRect.size);
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    [[UIColor blackColor] set];
    CGContextFillRect(ctx, screenRect);
    [view.layer renderInContext:ctx];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
    
}

-(void)printImage
{

    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsPath = [paths objectAtIndex:0]; //Get the docs directory
    NSString *filePath = [documentsPath stringByAppendingPathComponent:@"BillReceipt.png"]; //Add the file name
    bixolonPrintobj.receiptFilePath = filePath;
    NSLog(@"App delegate bill file path %@",filePath);
   /* _pController = [BXPrinterController getInstance];
    int nLevel = 50;
    [_pController printBitmap:filePath width:BXL_WIDTH_FULL level: nLevel];
    ViewController *billVC = [[ViewController alloc] initWithNibName:@"ViewController" bundle:nil];
    [billVC openCashDrawer];*/

}


@end
