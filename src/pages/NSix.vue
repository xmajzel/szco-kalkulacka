<template>
  <q-page class="n-index-page">
    <n-text
      weight="medium"
      font-size="h3"
      html-tag="h1"
      class="n-index-page__title"
      text="Mesačný výpočet daní a odvodov pre SZČO 2026"
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
          <n-text font-size="small" text="Minimálny vymeriavací základ pre zdravotné (mesačný)" />
          <q-input
            dense
            v-model.number="constantData.healthInsurance.minBase"
            suffix="€"
          />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Minimálny vymeriavací základ pre sociálne (mesačný)" />
          <q-input
            dense
            v-model.number="constantData.socialInsurance.minBase"
            suffix="€"
          />
        </div>

        <div class="n-index-page__input-container">
          <n-text font-size="small" text="Maximálny vymeriavací základ pre sociálne (mesačný)" />
          <q-input
            dense
            v-model.number="constantData.socialInsurance.maxBase"
            suffix="€"
          />
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
              text="Vymeriavací základ pre sociálne poistenie:"
            />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.socialAssessmentBase"
            />
          </div>
          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Vymeriavací základ pre zdravotné poistenie:"
            />
            <n-text
              font-size="paragraph"
              weight="bold"
              :text="results.healthAssessmentBase"
            />
          </div>
          <div>
            <n-text
              font-size="paragraph"
              class="n-mr-8"
              text="Sociálne poistenie (4.4% + 18% + 6% + 4.75%):"
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
              text="Zdravotné poistenie (16%):"
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

const constantData = reactive({
  healthInsurance: {
    minBase: 762,
    min: 121.92,
    rate: 0.16,
  },
  socialInsurance: {
    minBase: 914.4,
    maxBase: 16764,
    min: 303.11,
    rates: {
      sickness: 0.044,
      oldAge: 0.18,
      disability: 0.06,
      reserve: 0.0475,
    },
  },
  // Finančná správa SR: Prehľad súm potrebných pre výpočet daňovej povinnosti FO na rok 2026
  nonTaxableBase: 5966.73,
  nonTaxableMaxBase: 26083.13,
  nonTaxableBaseAdjustmentCoefficient: 14661.11,
  assessmentBaseCoefficient: 1.486,
  reducedTaxRateIncomeThreshold: 100000,
  higherTaxRateBrackets: {
    first: 43983.32,
    second: 60349.21,
    third: 75010.32,
  },
});

const inputs = reactive({
  sales: 0,
  expenses: 1666.66,
  healthInsuranceAdvances: 121.92,
  socialInsuranceAdvances: 303.11,
});

const results = computed(() => {
  const _tBase =
    isNotNaN(inputs.expenses) && isNotNaN(inputs.sales)
      ? Math.max(inputs.sales! - inputs.expenses, 0)
      : 0;
  const _rawAssessmentBase =
    isNotNaN(inputs.healthInsuranceAdvances) &&
    isNotNaN(inputs.socialInsuranceAdvances)
      ? (
          _tBase +
          inputs.healthInsuranceAdvances +
          inputs.socialInsuranceAdvances
        ) / constantData.assessmentBaseCoefficient
      : 0;
  const _socialAssessmentBase = Math.min(
    Math.max(_rawAssessmentBase, constantData.socialInsurance.minBase),
    constantData.socialInsurance.maxBase,
  );
  const _healthAssessmentBase = Math.max(
    _rawAssessmentBase,
    constantData.healthInsurance.minBase,
  );
  const _sInsurance = calculateSocialInsurance(_socialAssessmentBase);
  const _hInsurance = Math.max(
    constantData.healthInsurance.rate * _healthAssessmentBase,
    constantData.healthInsurance.min,
  );

  const annualTaxBaseBeforeAllowance = Math.max(
    (_tBase -
      inputs.healthInsuranceAdvances -
      inputs.socialInsuranceAdvances) *
      12,
    0,
  );
  const applicableNonTaxableBase =
    annualTaxBaseBeforeAllowance <= constantData.nonTaxableMaxBase
      ? constantData.nonTaxableBase / 12
      : Math.max(
          constantData.nonTaxableBaseAdjustmentCoefficient -
            annualTaxBaseBeforeAllowance / 3,
          0,
        ) / 12;

  const yearSales = inputs.sales * 12;
  const annualTaxBaseAfterAllowance = Math.max(annualTaxBaseBeforeAllowance - applicableNonTaxableBase * 12, 0);
  const annualTax = calculateAnnualTax(yearSales, annualTaxBaseAfterAllowance);
  const _tax = annualTax / 12;

  const _saveToNextYear = isNotNaN(inputs.healthInsuranceAdvances)
    ? Math.max(_tax + (_hInsurance - inputs.healthInsuranceAdvances), 0)
    : 0;
  const _rest = isNotNaN(inputs.sales)
    ? Math.max(inputs.sales - _saveToNextYear, 0)
    : 0;

  return {
    taxBase: `${valueToString(inputs.sales)} - ${valueToString(inputs.expenses)} = ${valueToString(_tBase)}€`,
    socialAssessmentBase: `max(min(${valueToString(_rawAssessmentBase)}€, ${valueToString(constantData.socialInsurance.maxBase)}€), ${valueToString(constantData.socialInsurance.minBase)}€) = ${valueToString(_socialAssessmentBase)}€`,
    healthAssessmentBase: `max(${valueToString(_rawAssessmentBase)}€, ${valueToString(constantData.healthInsurance.minBase)}€) = ${valueToString(_healthAssessmentBase)}€`,
    socialInsurance: `${valueToString(_sInsurance.sickness)} + ${valueToString(_sInsurance.oldAge)} + ${valueToString(_sInsurance.disability)} + ${valueToString(_sInsurance.reserve)} = ${valueToString(_sInsurance.total)}€`,
    healthInsurance: `${valueToString(_healthAssessmentBase)} * ${valueToString(constantData.healthInsurance.rate)} = ${valueToString(_hInsurance)}€`,
    tax: `((${valueToString(_tBase)} - ${valueToString(inputs.healthInsuranceAdvances)} - ${valueToString(inputs.socialInsuranceAdvances)}) * 12 - ${valueToString(applicableNonTaxableBase * 12)}) => ${valueToString(annualTax)} / 12 = ${valueToString(_tax)}€`,
    saveToNextYear: `${valueToString(_tax)} + (${valueToString(_hInsurance)} - ${valueToString(inputs.healthInsuranceAdvances)}) = ${valueToString(_saveToNextYear)}€`,
    rest: `${valueToString(inputs.sales)} - ${valueToString(_saveToNextYear)} = ${valueToString(_rest)}€`,
  };
});

function calculateAnnualTax(yearSales: number, annualTaxBaseAfterAllowance: number) {
  if (yearSales <= constantData.reducedTaxRateIncomeThreshold) {
    return annualTaxBaseAfterAllowance * 0.15;
  }

  const firstBracket = Math.min(
    annualTaxBaseAfterAllowance,
    constantData.higherTaxRateBrackets.first,
  );
  const secondBracket = Math.min(
    Math.max(
      annualTaxBaseAfterAllowance - constantData.higherTaxRateBrackets.first,
      0,
    ),
    constantData.higherTaxRateBrackets.second -
      constantData.higherTaxRateBrackets.first,
  );
  const thirdBracket = Math.min(
    Math.max(
      annualTaxBaseAfterAllowance - constantData.higherTaxRateBrackets.second,
      0,
    ),
    constantData.higherTaxRateBrackets.third -
      constantData.higherTaxRateBrackets.second,
  );
  const fourthBracket = Math.max(
    annualTaxBaseAfterAllowance - constantData.higherTaxRateBrackets.third,
    0,
  );

  return (
    firstBracket * 0.19 +
    secondBracket * 0.25 +
    thirdBracket * 0.3 +
    fourthBracket * 0.35
  );
}

function calculateSocialInsurance(assessmentBase: number) {
  const sickness = floorToCents(
    assessmentBase * constantData.socialInsurance.rates.sickness,
  );
  const oldAge = floorToCents(
    assessmentBase * constantData.socialInsurance.rates.oldAge,
  );
  const disability = floorToCents(
    assessmentBase * constantData.socialInsurance.rates.disability,
  );
  const reserve = floorToCents(
    assessmentBase * constantData.socialInsurance.rates.reserve,
  );

  return {
    sickness,
    oldAge,
    disability,
    reserve,
    total: sickness + oldAge + disability + reserve,
  };
}

function isNotNaN(value: unknown): boolean {
  return typeof value === 'number' && !Number.isNaN(value);
}

function floorToCents(value: number) {
  return Math.floor(value * 100) / 100;
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
