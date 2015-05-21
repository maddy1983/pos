//
//  BillReceiptTableViewCell.m
//  POS
//
//  Created by ScriptLanes on 28/07/14.
//
//

#import "BillReceiptTableViewCell.h"

@implementation BillReceiptTableViewCell
@synthesize serialNO,itemName,rate,quantity,value;
- (void)awakeFromNib
{
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
