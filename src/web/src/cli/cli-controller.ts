import { Command } from 'commander';

import type { AssertionViewGenerator } from '@asap/shared/use-cases/assertion-views';
import type { OscalService } from '@asap/shared/use-cases/oscal';
import { SchematronCompiler } from '@asap/shared/use-cases/schematron-compiler';
import { SchematronSummary } from '@asap/shared/use-cases/schematron-summary';
import type { XSpecAssertionSummaryGenerator } from '@asap/shared/use-cases/xspec-summary';

export type CommandLineContext = {
  console: Console;
  useCases: {
    assertionViewGenerator: AssertionViewGenerator;
    oscalService: OscalService;
    schematronCompiler: SchematronCompiler;
    schematronSummary: SchematronSummary;
    xSpecAssertionSummaryGenerator: XSpecAssertionSummaryGenerator;
  };
};

export const CommandLineController = (ctx: CommandLineContext) => {
  const cli = new Command();
  cli
    .command('compile-schematron')
    .description(
      'compile schematron for each ruleset using the saxon-js xslt3 package',
    )
    .action(async () => {
      await ctx.useCases.schematronCompiler.compileAll();
    });
  cli
    .command('validate <schematron-ruleset> <oscal-file-path>')
    .description('validate OSCAL document (SSP, SAP, SAR, or POA&M)')
    .action(async (schematronRuleset, oscalFilePath) => {
      await ctx.useCases.oscalService.validateOscalFile(
        schematronRuleset,
        oscalFilePath,
      );
    });
  cli
    .command('generate-schematron-summaries')
    .description('parse all Schematron XML and outputs JSON summaries')
    .action(() => ctx.useCases.schematronSummary.generateAllSummaries());
  cli
    .command('create-assertion-view')
    .description(
      'write UI-optimized JSON of assertion views to target location',
    )
    .action(async () => {
      await ctx.useCases.assertionViewGenerator.generateAll();
    });
  cli
    .command('create-xspec-summaries')
    .description(
      'write UI-optimized JSON xspec scenario summaries, useful for usage examples',
    )
    .action(async () => {
      await ctx.useCases.xSpecAssertionSummaryGenerator.generateAll();
    });
  return cli;
};
export type CommandLineController = ReturnType<typeof CommandLineController>;
