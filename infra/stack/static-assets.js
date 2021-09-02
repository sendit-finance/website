const { Stack, Duration } = require('@aws-cdk/core')
const { join } = require('path')
const { Bucket, BucketAccessControl, HttpMethods } = require('@aws-cdk/aws-s3')
const {
  BucketDeployment,
  Source,
  CacheControl
} = require('@aws-cdk/aws-s3-deployment')
const {
  CloudFrontWebDistribution,
  PriceClass
} = require('@aws-cdk/aws-cloudfront')
const { ARecord, RecordTarget } = require('@aws-cdk/aws-route53')
const { CloudFrontTarget } = require('@aws-cdk/aws-route53-targets')
const { PublicHostedZone } = require('@aws-cdk/aws-route53')

class StaticAssetsStack extends Stack {
  constructor(app, id, props) {
    super(app, id, props)

    const stage = props.stage
    const { staticAssetsHostName, hostName } = this.node.tryGetContext(
      props.stage
    )

    const certificateArn = this.node.tryGetContext('certificateArn')
    const { hostedZoneId, zoneName } = this.node.tryGetContext('zone')

    const zone = PublicHostedZone.fromHostedZoneAttributes(
      this,
      `${id}-${stage}-route-53`,
      {
        hostedZoneId,
        zoneName
      }
    )

    const staticAssets = new Bucket(this, `${id}-${stage}-assets`, {
      accessControl: BucketAccessControl.PUBLIC_READ,
      bucketName: `sendit-cdn-static-assets-${stage}`,
      publicReadAccess: true
    })

    staticAssets.addCorsRule({
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
      allowedOrigins: [`https://${hostName}`]
    })

    const productionDistribution = new CloudFrontWebDistribution(
      this,
      `${id}-${stage}-distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: staticAssets
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true
              }
            ]
          }
        ],
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [staticAssetsHostName]
        },
        priceClass: PriceClass.PRICE_CLASS_100
      }
    )

    new ARecord(this, `${id}-${stage}-alias-record`, {
      zone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(productionDistribution)
      ),
      recordName: staticAssetsHostName
    })
  }
}

module.exports = { StaticAssetsStack }
