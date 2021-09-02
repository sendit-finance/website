const { join, relative } = require('path')
const { Stack, Duration } = require('@aws-cdk/core')
const {
  PublicHostedZone,
  RecordTarget,
  ARecord
} = require('@aws-cdk/aws-route53')
const {
  CloudFrontTarget,
  BucketWebsiteTarget
} = require('@aws-cdk/aws-route53-targets')
const {
  PriceClass,
  CloudFrontWebDistribution,
  OriginProtocolPolicy
} = require('@aws-cdk/aws-cloudfront')
const {
  Bucket,
  BucketAccessControl,
  RedirectProtocol,
  ReplaceKey
} = require('@aws-cdk/aws-s3')
const {
  BucketDeployment,
  Source,
  CacheControl
} = require('@aws-cdk/aws-s3-deployment')
const { readFileSync } = require('fs')
const glob = require('glob')

const DEPRECATED_PATH = join(__dirname, '..', '..', 'src', 'deprecated')

class WebsiteStack extends Stack {
  constructor(app, id, props) {
    super(app, id, props)

    const stage = props.stage
    const { hostName, redirectHostName } = this.node.tryGetContext(props.stage)

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

    const files = glob.sync(join(DEPRECATED_PATH, '**/*'))

    const redirectRules = files.map((path) => {
      const redirectFrom = relative(DEPRECATED_PATH, path)
      const redirectTo = readFileSync(path).toString()

      return {
        hostName,
        httpRedirectCode: '301',
        protocol: RedirectProtocol.HTTPS,
        replaceKey: ReplaceKey.with(redirectTo),
        condition: {
          keyPrefixEquals: redirectFrom
        }
      }
    })

    const websiteAssets = new Bucket(this, `${id}-${stage}-website-assets`, {
      accessControl: BucketAccessControl.PUBLIC_READ,
      bucketName: `sendit-website-static-assets-${stage}`,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404/index.html',
      websiteRoutingRules: redirectRules
    })

    new BucketDeployment(this, 'DeployWebsite', {
      actionName: 'Website Deployment',
      sources: [Source.asset(join(__dirname, '..', '..', 'out'))],
      destinationBucket: websiteAssets,
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.minutes(5))
      ],
      prune: false
    })

    this.productionDistribution = new CloudFrontWebDistribution(
      this,
      `${id}-${stage}-website-distribution`,
      {
        originConfigs: [
          {
            customOriginSource: {
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
              domainName: websiteAssets.bucketWebsiteDomainName
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
          names: [hostName]
        },
        priceClass: PriceClass.PRICE_CLASS_100
      }
    )

    new ARecord(this, `${id}-${stage}-alias-record`, {
      zone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(this.productionDistribution)
      ),
      recordName: hostName
    })

    if (redirectHostName) {
      const websiteAssetsRedirect = new Bucket(
        this,
        `${id}-${stage}-assets-www-redirect`,
        {
          bucketName: redirectHostName,
          websiteRedirect: {
            hostName: hostName,
            protocol: RedirectProtocol.HTTPS
          }
        }
      )

      const redirectDistribution = new CloudFrontWebDistribution(
        this,
        `${id}-${stage}-distribution-redirect`,
        {
          defaultRootObject: '',
          originConfigs: [
            {
              customOriginSource: {
                originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
                domainName: websiteAssetsRedirect.bucketWebsiteDomainName
              },
              behaviors: [
                {
                  isDefaultBehavior: true
                }
              ]
            }
          ],
          aliasConfiguration: {
            acmCertRef: certificateArn,
            names: [redirectHostName]
          },
          priceClass: PriceClass.PRICE_CLASS_100
        }
      )

      new ARecord(this, `${id}-${stage}-alias-record-www-redirect`, {
        zone,
        target: RecordTarget.fromAlias(
          new CloudFrontTarget(redirectDistribution)
        ),
        recordName: redirectHostName
      })
    }
  }
}

module.exports = { WebsiteStack }
