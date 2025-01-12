/**********************************************************************
 * Copyright (c) 2020-2021 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 ***********************************************************************/
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import * as path from 'path';

import { CheEditorsAnalyzer } from '../../src/editor/che-editors-analyzer';
import { Container } from 'inversify';

describe('Test CheEditorsAnalyzer', () => {
  let container: Container;

  let cheEditorsAnalyzer: CheEditorsAnalyzer;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    container = new Container();
    container.bind(CheEditorsAnalyzer).toSelf().inSingletonScope();
    cheEditorsAnalyzer = container.get(CheEditorsAnalyzer);
  });

  test('basics', async () => {
    const testContentPath = path.resolve(__dirname, '..', '..', '..', '..', 'che-editors.yaml');
    const result = await cheEditorsAnalyzer.analyze(testContentPath);
    expect(result).toBeDefined();
    expect(result.editors).toBeDefined();
    expect(result.editors.length).toBeGreaterThan(5);

    // search for editors with an id provided in yaml
    const codeEditors = result.editors.filter(plugin => plugin.metadata.name === 'che-incubator/che-code/insiders');
    expect(codeEditors).toBeDefined();
    expect(codeEditors.length).toBe(1);
    const codeEditor = codeEditors[0];
    expect(codeEditor.metadata.attributes.repository).toBe('https://github.com/che-incubator/che-code');
  });
});
