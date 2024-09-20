// Copyright (c) 2024, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import type {PreliminaryCompilerInfo} from '../../types/compiler.interfaces.js';
import type {CompilationEnvironment} from '../compilation-env.js';
import type {ExecutionOptions} from '../../types/compilation/compilation.interfaces.js';
import type {ConfiguredOverrides} from '../../types/compilation/compiler-overrides.interfaces.js';
import type {SelectedLibraryVersion} from '../../types/libraries/libraries.interfaces.js';
import type {ParseFiltersAndOutputOptions} from '../../types/features/filters.interfaces.js';
import {BaseCompiler} from '../base-compiler.js';
import {AsmParserCpp} from '../parsers/asm-parser-cpp.js';

export class BrontoTranslateCompiler extends BaseCompiler {
  static get key() { return 'bronto-translate'; }

  constructor(info: PreliminaryCompilerInfo, env: CompilationEnvironment) {
      super(info, env);

      // TODO: customize this parser to tie the result back to the input source
      this.asm = new AsmParserCpp();
  }

  override prepareArguments(
      userOptions: string[],
      _filters: ParseFiltersAndOutputOptions,
      _backendOptions: Record<string, any>,
      inputFilename: string,
      outputFilename: string,
      _libraries: SelectedLibraryVersion[],
      _overrides: ConfiguredOverrides,
  ) {
    if (userOptions.indexOf("--") == -1) {
      userOptions.push("--");
    }

    let [cmd, ...options] = userOptions;
    return [cmd, inputFilename, outputFilename, ...options, "-c", inputFilename, "-o", outputFilename];
  }

  override async runCompiler(
      compiler: string,
      options: string[],
      inputFilename: string,
      execOptions: ExecutionOptions&{env : Record<string, string>},
  ) {
    if (!execOptions) {
      execOptions = this.getDefaultExecOptions();
    }

    return await super.runCompiler(compiler, options, inputFilename,
                                   execOptions);
  }
}
