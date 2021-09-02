const { Stage, CfnOutput } = require('@aws-cdk/core')
const { WebsiteStack } = require('../stack/website')
const { StaticAssetsStack } = require('../stack/static-assets')

class Application extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props)

    const website = new WebsiteStack(this, `website-${props.stage}`, {
      stage: props.stage
    })

    new StaticAssetsStack(this, `static-assets-${props.stage}`, {
      stage: props.stage
    })

    this.cloudfrontDistributionId = new CfnOutput(
      website,
      `website-distribution-id-${props.stage}`,
      {
        value: website.productionDistribution.distributionId
      }
    )
  }
}

module.exports = {
  Application
}
