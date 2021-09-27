---
name: Cypress failure
about: ''
title: '{{ env.branch_name }} Cypress run failed'
assignees: '{{ payload.sender.login }}'

---

Cypress [failed]({{ tools.context.ref }}) for the {{ env.branch_name }} branch.
