import io, re, sys

s = io.open('../../../apps/psi-gym.html', encoding='utf-8').read()
i = s.find('<section class="app-detailed-info"')
j = s.find('</section>', i)
print('start', i, 'end', j)
print(repr(s[j - 800:j + 60]))
print('--- CTA blocks ---')
for m in re.finditer(r'cta-centered-wrapper', s):
    print(m.start(), repr(s[m.start() - 120:m.start() + 160]))
