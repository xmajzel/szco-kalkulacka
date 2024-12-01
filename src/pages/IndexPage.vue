<template>
  <q-page class="n-index-page">
    <n-text
      weight="medium"
      font-size="h3"
      html-tag="h1"
      class="n-index-page__title"
      text="Mesačný výpočet daní a odvodov pre SZČO 2024"
    />

    <div class="n-index-page__content">
      <n-card size="lg" divider="footer" variant="shadow-2">
        <template #header>
          <n-text weight="medium" font-size="h4" html-tag="h2" text="Vstupy" />
        </template>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Tržby" />
          <q-input dense v-model.number="inputs.sales" suffix="€" />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Výdavky" />
          <q-input dense v-model.number="inputs.expenses" suffix="€" />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Preddavky na zdravotné poistenie" />
          <q-input
            dense
            v-model.number="inputs.healthInsuranceAdvances"
            suffix="€"
          />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Preddavky na sociálne poistenie" />
          <q-input
            dense
            v-model.number="inputs.socialInsuranceAdvances"
            suffix="€"
          />
        </div>
      </n-card>

      <n-card size="lg" divider="footer" variant="shadow-2">
        <template #header>
          <n-text
            weight="medium"
            font-size="h4"
            html-tag="h2"
            text="Konštanty"
          />
          <n-text
            weight="light"
            font-size="paragraph-2"
            text="Konštanty, ktoré sa menia k 1.1 nového roka podľa min. mzdy alebo životného minima."
          />
        </template>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Minimálny vymeriavací základ (mesačný)" />
          <q-input dense v-model.number="constantData.taxBase.min" suffix="€" />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Maximálny vymeriavací základ (mesačný)" />
          <q-input dense v-model.number="constantData.taxBase.max" suffix="€" />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Minimálne zdravotné odvody (mesačné)" />
          <q-input
            dense
            v-model.number="constantData.healthInsurance.min"
            suffix="€"
          />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Minimálne sociálne odvody (mesačné)" />
          <q-input
            dense
            v-model.number="constantData.socialInsurance.min"
            suffix="€"
          />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Nezdaniteľná časť základu dane (ročná)" />
          <q-input
            dense
            v-model.number="constantData.nonTaxableBase"
            suffix="€"
          />
        </div>
      </n-card>

      <n-card size="lg" divider="none" variant="shadow-2">
        <template #header>
          <n-text weight="medium" font-size="h4" html-tag="h2" text="Výpočet" />
        </template>

        <div>
          <div>
            <n-text font-size="paragraph" class="n-mr-8" text="Základ dane: " />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.taxBase"
            />
          </div>
          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Vymeriavací základ dane:"
            />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.taxAssessmentBase"
            />
          </div>
          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Sociálne poistenie (33.15%):"
            />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.socialInsurance"
            />
          </div>
          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Zdravotné poistenie (15%):"
            />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.healthInsurance"
            />
          </div>
        </div>

        <template #footer>
          <div>
            <n-text font-size="paragraph" class="n-mr-8" text="Daň:" />
            <n-text weight="bold" font-size="paragraph" :text="results.tax" />
          </div>

          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Daň + doplatky na zdravotné (potrebujem o rok):"
            />
            <n-text weight="bold" font-size="paragraph" :text="results.saveToNextYear" />
          </div>

          <div>
            <n-text font-size="paragraph" class="n-mr-8" text="Zvyšok (čistý zisk + preddavky):" />
            <n-text weight="bold" font-size="paragraph" :text="results.rest" />
          </div>
        </template>
      </n-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { NCard, NText } from '@nova-org/components';

// TODO: Maybe clean up this mess and move all inlined constants to 'constantData'
const constantData = reactive({
  taxBase: {
    min: 652,
    max: 9128,
  },
  healthInsurance: {
    min: 97.8,
  },
  socialInsurance: {
    min: 216.13,
  },
  nonTaxableBase: 5646.48,
  assessmentBaseCoefficient: 1.486,
});

const inputs = reactive({
  sales: 0,
  expenses: 1666.66,
  healthInsuranceAdvances: 97.8,
  socialInsuranceAdvances: 216.13,
});

const results = computed(() => {
  const _tBase =
    isNotNaN(inputs.expenses) && isNotNaN(inputs.sales)
      ? Math.max(inputs.sales! - inputs.expenses, 0)
      : 0;
  const _tAssessmentBase =
    isNotNaN(inputs.healthInsuranceAdvances) &&
    isNotNaN(inputs.socialInsuranceAdvances)
      ? Math.min(
          Math.max(
            (_tBase +
              inputs.healthInsuranceAdvances +
              inputs.socialInsuranceAdvances) /
              constantData.assessmentBaseCoefficient,
            652,
          ),
          9128,
        )
      : 0;
  const _sInsurance = Math.max(
    0.3315 * _tAssessmentBase,
    constantData.socialInsurance.min,
  );
  const _hInsurance = Math.max(
    0.15 * _tAssessmentBase,
    constantData.healthInsurance.min,
  );

  const applicableNonTaxableBase =
    _tAssessmentBase * 12 < 24962
      ? constantData.nonTaxableBase / 12
      : Math.max(11884.5 - (1 / 4) * (_tAssessmentBase * 12), 0) / 12;

  let _tax = 0;
  const yearSales = inputs.sales * 12;
  if (yearSales < 60000) {
    _tax = 0.15 * Math.max(_tAssessmentBase - applicableNonTaxableBase, 0);
  } else {
    // TODO: A bit more complicated :)  - guess freelancer will not hit it :)
  }

  const _saveToNextYear = isNotNaN(inputs.healthInsuranceAdvances)
    ? Math.max(_tax + (_hInsurance - inputs.healthInsuranceAdvances), 0)
    : 0;
  const _rest = isNotNaN(inputs.sales)
    ? Math.max(inputs.sales - _saveToNextYear, 0)
    : 0;

  return {
    taxBase: `${valueToString(inputs.sales)} - ${valueToString(inputs.expenses)} = ${valueToString(_tBase)}€`,
    taxAssessmentBase: `(${valueToString(_tBase)} + ${valueToString(inputs.healthInsuranceAdvances)} + ${valueToString(inputs.socialInsuranceAdvances)}) / ${valueToString(constantData.assessmentBaseCoefficient)} = ${valueToString(_tAssessmentBase)}€`,
    socialInsurance: `${valueToString(_tAssessmentBase)} * 0.3315 = ${valueToString(_sInsurance)}€`,
    healthInsurance: `${valueToString(_tAssessmentBase)} * 0.15 = ${valueToString(_hInsurance)}€`,
    tax: `${valueToString(_tAssessmentBase)} - ${valueToString(applicableNonTaxableBase)} * 0.15 = ${valueToString(_tax)}€`,
    saveToNextYear: `${valueToString(_tax)} + (${valueToString(_hInsurance)} - ${valueToString(inputs.healthInsuranceAdvances)}) = ${valueToString(_saveToNextYear)}€`,
    rest: `${valueToString(inputs.sales)} - ${valueToString(_saveToNextYear)} = ${valueToString(_rest)}€`,
  };
});

function isNotNaN(value: unknown): boolean {
  return typeof value === 'number' && !Number.isNaN(value);
}

function valueToString(value: unknown) {
  if (isNotNaN(value)) {
    const _val = value as number;
    return hasThreeDecimals(_val) ? _val : _val.toFixed(2);
  }
  return '...';
}

function hasThreeDecimals(num: number) {
  return num % 1 !== 0 && num.toString().split('.')[1]?.length === 3;
}
</script>

<style scoped lang="scss">
.n-index-page {
  padding: $n-space-12;

  .n-index-page__title {
    text-align: center;
    margin-bottom: $n-space-64;
  }

  .n-index-page__content {
    display: flex;
    flex-wrap: wrap;
    gap: $n-space-32;

    > * {
      width: calc((100% - $n-space-32) / 2);

      h2 {
        margin: 0;
      }

      .n-index-page__input-container {
        display: flex;
        flex-direction: column;

        :deep(.q-field__control) {
          height: 25px;

          .q-field__suffix {
            line-height: 1;
          }
        }

        & + .n-index-page__input-container {
          margin-top: $n-space-16;
        }
      }
    }

    @media (max-width: 800px) {
      flex-direction: column;

      > * {
        width: 100%;
      }
    }

    > *:last-child {
      width: 100%;
    }
  }
}
</style>
