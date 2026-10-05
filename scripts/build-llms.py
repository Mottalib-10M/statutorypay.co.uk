#!/usr/bin/env python3
"""Writes public/llms.txt from the built site (RECETTE §21): what the site is, its data, its pages.
Run after `npm run build`: python3 scripts/build-llms.py"""
import glob, html, os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = re.search(r'SITE_URL = "([^"]+)"', open(f'{root}/src/data/site-config.ts').read()).group(1)
pages = []
for f in sorted(glob.glob(f'{root}/dist/en/**/index.html', recursive=True)):
    doc = open(f, encoding='utf-8').read()
    if 'content="noindex' in doc: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', doc, re.S).group(1)).strip()
    d = html.unescape(re.search(r'name="description" content="([^"]*)"', doc).group(1))
    path = '/' + os.path.relpath(os.path.dirname(f), f'{root}/dist').replace(os.sep, '/') + '/'
    pages.append((path, t, d))
out = ['# UK Work Rights', '', '> Free calculators of statutory employment rights in the United Kingdom for the 2026/27 tax year: redundancy pay, notice, holiday entitlement and holiday pay, maternity, paternity, shared parental and adoption pay, and Statutory Sick Pay, for Great Britain and Northern Ireland. Published by Radif Partners. Every figure is read in legislation.gov.uk, HMRC rates and thresholds, GOV.UK, Acas or nidirect, and dated in one parameter file. Calculations run in the browser.', '', '## Pages', '']
out += [f'- [{t}]({site}{p}): {d}' for p, t, d in pages]
open(f'{root}/public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(f'llms.txt: {len(pages)} pages')
