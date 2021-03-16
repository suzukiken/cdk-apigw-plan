#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkapigwplanStack } from '../lib/cdkapigwplan-stack';

const app = new cdk.App();
new CdkapigwplanStack(app, 'CdkapigwplanStack');
