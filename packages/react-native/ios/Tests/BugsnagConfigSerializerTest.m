//
//  BugsnagConfigSerializerTest.m
//  Tests
//
//  Created by Jamie Lynch on 16/03/2020.
//  Copyright © 2020 Bugsnag, Inc. All rights reserved.
//

#import <XCTest/XCTest.h>

#import "BugsnagConfigSerializer.h"
#import "Bugsnag.h"

@interface BugsnagConfigSerializerTest : XCTestCase
@property BugsnagConfiguration *config;
@end

@implementation BugsnagConfigSerializerTest

- (void)setUp {
    NSError *err;
    self.config = [[BugsnagConfiguration alloc] initWithApiKey:@"0abcdef000000abcdef000000abcdef0"
                                                                          error:&err];
    self.config.notifyReleaseStages = @[@"production"];
    self.config.releaseStage = @"production";
    self.config.appVersion = @"1.4.3";
    self.config.notifierType = @"cocoa";
}

- (void)testExample {
    BugsnagConfigSerializer *serializer = [BugsnagConfigSerializer new];
    NSDictionary *data = [serializer serialize:self.config];
    
    XCTAssertEqualObjects(@"0abcdef000000abcdef000000abcdef0", data[@"apiKey"]);
    XCTAssertTrue(data[@"autoDetectErrors"]);
    XCTAssertTrue(data[@"autoTrackSessions"]);
    XCTAssertEqualObjects(@[@"production"], data[@"enabledReleaseStages"]);
    XCTAssertEqualObjects(@"production", data[@"releaseStage"]);
    XCTAssertEqualObjects(@"1.4.3", data[@"appVersion"]);
    XCTAssertEqualObjects(@"cocoa", data[@"type"]);
    XCTAssertTrue(data[@"persistUser"]);
    XCTAssertEqualObjects([NSNumber numberWithInt:25], data[@"maxBreadcrumbs"]);
    
    NSDictionary *endpoints = data[@"endpoints"];
    XCTAssertEqualObjects(@"https://notify.bugsnag.com/", endpoints[@"notify"]);
    XCTAssertEqualObjects(@"https://sessions.bugsnag.com", endpoints[@"sessions"]);
}

@end
