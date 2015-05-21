//
//  BillReceiptTableViewCell.h
//  POS
//
//  Created by ScriptLanes on 28/07/14.
//
//

#import <UIKit/UIKit.h>

@interface BillReceiptTableViewCell : UITableViewCell
@property (strong, nonatomic) IBOutlet UILabel *serialNO;

@property (strong, nonatomic) IBOutlet UILabel *itemName;
@property (strong, nonatomic) IBOutlet UILabel *rate;

@property (strong, nonatomic) IBOutlet UILabel *quantity;
@property (strong, nonatomic) IBOutlet UILabel *value;

@end
