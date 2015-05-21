//
//  BillReceiptViewController.h
//  POS
//
//  Created by ScriptLanes on 28/07/14.
//
//

#import <UIKit/UIKit.h>
#import "BXPrinterController.h"

@interface BillReceiptViewController : UIViewController
{
    BXPrinterController*    _pController;

}
@property (strong, nonatomic) IBOutlet UITableView *billTableView;
@property (strong, nonatomic) IBOutlet UIView *VisitAgainView;
@property (strong, nonatomic) IBOutlet UILabel *billNo;
@property (strong, nonatomic) IBOutlet UILabel *paymentType;
@property (strong, nonatomic) IBOutlet UILabel *BillDate;
@property (strong, nonatomic) IBOutlet UILabel *billTime;
@property (strong, nonatomic) IBOutlet UILabel *totalAmount;
//madhu
@property (strong, nonatomic) IBOutlet UILabel *lblGiftCard;
@property (strong, nonatomic) IBOutlet UILabel *lblDiscount;
@property (strong, nonatomic) IBOutlet UILabel *lblABNCode;
@property (strong, nonatomic) IBOutlet UILabel *lblCompanyName;
@property (strong, nonatomic) IBOutlet UILabel *lblsubtotal;


@property (strong, nonatomic)NSDictionary *responseDictionary;
@property (strong, nonatomic)NSString *paymentOption;
-(void)setTheView;
@end
