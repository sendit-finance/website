const { Artifact } = require('@aws-cdk/aws-codepipeline')
const {
  CdkPipeline,
  SimpleSynthAction,
  ShellScriptAction
} = require('@aws-cdk/pipelines')
const { Stack } = require('@aws-cdk/core')
const {
  CodeStarConnectionsSourceAction
} = require('@aws-cdk/aws-codepipeline-actions')
const { Effect, PolicyStatement } = require('@aws-cdk/aws-iam')
const { Application } = require('../stage/application')
const { LinuxBuildImage } = require('@aws-cdk/aws-codebuild')

class PipelineStack extends Stack {
  constructor(app, id, props) {
    super(app, id, props)

    const sourceArtifact = new Artifact('src')
    const cloudAssemblyArtifact = new Artifact('asmb')
    const { owner, name, githubConnectionArn, branch } =
      this.node.tryGetContext('repo')

    const cloudFrontPolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['cloudfront:GetInvalidation', 'cloudfront:CreateInvalidation'],
      resources: ['*']
    })

    const parameterStorePolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['ssm:Describe*', 'ssm:Get*', 'ssm:List*'],
      resources: ['*']
    })

    const synthAction = SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      buildCommand: 'npm run build',
      testCommands: ['npm run test:ci'],
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0
      },
      rolePolicyStatements: [parameterStorePolicyStatement]
    })

    const pipeline = new CdkPipeline(this, 'website', {
      pipelineName: 'Website',
      cloudAssemblyArtifact,

      sourceAction: new CodeStarConnectionsSourceAction({
        actionName: 'GitHub',
        owner,
        repo: name,
        connectionArn: githubConnectionArn,
        output: sourceArtifact,
        branch: branch || 'main'
      }),

      synthAction
    })

    const cfnProject = synthAction.project.node.defaultChild
    cfnProject.addOverride(
      'Properties.Source.BuildSpec',
      `{
        "version": "0.2",
        "env": {
          "git-credential-helper": "yes", 
          "parameter-store":{
            "build_ssh_key": "/prod/github/ssh"
          }
        },
        "phases": {
          "pre_build": {
            "commands": [
              "mkdir -p ~/.ssh",
              "echo \\"$build_ssh_key\\" > ~/.ssh/id_rsa",
              "chmod 600 ~/.ssh/id_rsa",
              "ssh-keygen -F github.com || ssh-keyscan github.com >>~/.ssh/known_hosts",
              "git config --global url.\\"git@github.com:\\".insteadOf \\"https://github.com/\\"",
              "npm ci"
            ]
          },
          "build": {
            "commands": [
              "npm run build",
              "npm run test:ci",
              "npx cdk synth"
            ]
          }
        },
        "artifacts": {
          "base-directory": "cdk.out",
          "files": "**/*"
        }
      }`
    )

    const applicationTesting = new Application(this, 'Testing', {
      stageName: 'Testing',
      description: 'Website testing stack running in us-east-1.',
      stage: 'testing',
      env: {
        region: 'us-east-1'
      }
    })

    const stageTesting = pipeline.addApplicationStage(applicationTesting)

    const actionTesting = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationTesting.cloudfrontDistributionId
        )
      }
    })

    stageTesting.addActions(actionTesting)

    actionTesting.project.addToRolePolicy(cloudFrontPolicyStatement)

    // Staging
    const applicationStaging = new Application(this, 'Staging', {
      stageName: 'Staging',
      description: 'Website staging stack running in us-east-1.',
      stage: 'staging',
      env: {
        region: 'us-east-1'
      }
    })

    const stageStaging = pipeline.addApplicationStage(applicationStaging)

    const actionStaging = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationStaging.cloudfrontDistributionId
        )
      }
    })

    stageStaging.addActions(actionStaging)

    actionStaging.project.addToRolePolicy(cloudFrontPolicyStatement)

    // Production
    const applicationProduction = new Application(this, 'Production', {
      stageName: 'Production',
      description: 'Website application stack running in us-east-1.',
      stage: 'production',
      env: {
        region: 'us-east-1'
      }
    })

    const stageProduction = pipeline.addApplicationStage(
      applicationProduction,
      {
        manualApprovals: true
      }
    )

    const actionProduction = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationProduction.cloudfrontDistributionId
        )
      }
    })

    stageProduction.addActions(actionProduction)

    actionProduction.project.addToRolePolicy(cloudFrontPolicyStatement)
  }
}

module.exports = { PipelineStack }
