#import "Bugsnag.h"
#import "BugsnagReactNative.h"
#import "BugsnagReactNativeEmitter.h"
#import "BugsnagConfigSerializer.h"

@interface Bugsnag ()
+ (id)client;
+ (BOOL)bugsnagStarted;
+ (BugsnagConfiguration *)configuration;
@end

@interface BugsnagReactNative ()
@property (nonatomic) BugsnagConfigSerializer *configSerializer;
@end

@implementation BugsnagReactNative

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(configureAsync:(NSDictionary *)readableMap
                         resolve:(RCTPromiseResolveBlock)resolve
                          reject:(RCTPromiseRejectBlock)reject) {
    resolve([self configure:readableMap]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(configure:(NSDictionary *)readableMap) {
    self.configSerializer = [BugsnagConfigSerializer new];

    if (![Bugsnag bugsnagStarted]) {
        // TODO: fail loudly here
        return nil;
    }

    // TODO: use this emitter to notifier JS of changes to user, context and metadata
    BugsnagReactNativeEmitter *emitter = [BugsnagReactNativeEmitter new];

    BugsnagConfiguration *config = [Bugsnag configuration];
    return [self.configSerializer serialize:config];
}

RCT_EXPORT_METHOD(updateMetadata
                  :(NSString *)section
          withData:(NSDictionary *)update) {
  //TODO
}

RCT_EXPORT_METHOD(updateContext:(NSString *)context) {
    [Bugsnag setContext:context];
}

RCT_EXPORT_METHOD(updateCodeBundleId:(NSString *)codeBundleId) {
    // TODO
}

RCT_EXPORT_METHOD(updateUser:(NSString *)userId
                   withEmail:(NSString *)email
                    withName:(NSString *)name) {
    [Bugsnag setUser:userId withEmail:email andName:name];
}

RCT_EXPORT_METHOD(dispatch:(NSDictionary *)payload
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject) {
    resolve(@{});
}

RCT_EXPORT_METHOD(leaveBreadcrumb:(NSDictionary *)options) {
  //TODO
}

RCT_EXPORT_METHOD(startSession) {
    [Bugsnag startSession];
}

RCT_EXPORT_METHOD(pauseSession) {
    [Bugsnag pauseSession];
}

RCT_EXPORT_METHOD(resumeSession) {
    [Bugsnag resumeSession];
}

RCT_EXPORT_METHOD(getPayloadInfo:(NSDictionary *)options
                         resolve:(RCTPromiseResolveBlock)resolve
                          reject:(RCTPromiseRejectBlock)reject) {
    resolve(@{});
}

@end
