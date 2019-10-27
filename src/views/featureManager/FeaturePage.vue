<template>
  <v-app id="inspire">
    <v-card>
      <BasePageTitle>Feature manager</BasePageTitle>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-col>
              <v-row>
                <!-- TOOLTIP -->
                <template>
                  <BaseTooltip>{{tooltips.company}}</BaseTooltip>
                </template>
                <!-- COMPANY -->
                <v-select
                  :items="feature.companies"
                  name="company"
                  item-text="CompanyName"
                  filled
                  return-object
                  label="Company"
                  hint="Select company"
                  persistent-hint
                  v-model="selectedCompany"
                  @change="setSelectedCompany"
                ></v-select>
              </v-row>
            </v-col>

            <!-- SETTINGS -->
            <v-col>
              <v-row>
                <template v-if="selectedCompany">
                  <BaseTooltip>{{tooltips.settings}}</BaseTooltip>
                </template>
                <!-- Select options -->
                <v-select
                  :items="selectOptions"
                  name="group"
                  item-text="name"
                  item-value="key"
                  filled
                  label="Settings"
                  hint="Select portal or user group"
                  persistent-hint
                  v-model="settingsType"
                  @change="onSettingsTypeChange"
                  :disabled="isSettingsDisabled"
                ></v-select>
              </v-row>
            </v-col>
            <v-col v-if="settingsType==='group'">
              <v-row>
                 <template>
                  <BaseTooltip>{{tooltips.userGroup}}</BaseTooltip>
                </template>               
              <v-select
                :items="feature.groups"
                name="group"
                item-text="name"
                item-value="guid"
                filled
                label="User Groups"
                hint="Select a user group"
                persistent-hint
                v-model="selectedGroupGuid"
                @change="onSelectedGroupChange"
              ></v-select>
              </v-row>
            </v-col>
          </v-col>
          <!-- IF PORTAL IS SELECTED -->
          <v-col cols="6" v-if="settingsType==='portal'">
            <FeatureContainer
              :currentFeatures="currentFeatures"
              @updateModules="featuresIds=$event"
              :selCompany="selectedCompany"
            />
          </v-col>
          <!-- IF USERS GROUP -->
          <v-col cols="6" v-if="settingsType==='group' && selectedGroupGuid">
            <FeatureContainer
              :currentFeatures="currentFeatures"
              @updateModules="featuresIds=$event"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <!-- SUBMIT BUTTON -->
      <v-card-actions class="grey darken-2 mx-0 title-page" v-if="submitEnabled">
        <v-row justify="center">
          <BaseSubmitGroup @submit="submitted" :cancelVisible="false">
            <template v-slot:submit>Confirm changes</template>
          </BaseSubmitGroup>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import FeatureDetail from './FeatureDetail'
import NotificationContainer from '../../components/NotificationContainer'
import FeatureCard from './FeatureCard'
import FeatureContainer from './FeatureContainer'

export default {
  data() {
    return {
      companies: null,
      featuresIds: [],
      currentFeatures: [],
      selectedCompany: null,
      selectedGroupGuid: null,
      settingsType: null,
      isSubmited: false,
      submitEnabled: false,
      selectOptions: [
        {
          key: 'portal',
          name: 'Portal'
        },
        {
          key: 'group',
          name: 'User Group'
        }
      ],
      tooltips: {
        company: 'Select company first to manage features',
        settings: 'Choose Portal or User group',
        userGroup:'Select user group for selected company'
      },
    }
  },
  components: {
    FeatureDetail,
    NotificationContainer,
    FeatureContainer
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store
      .dispatch('feature/loadPortals')
      .then(store.dispatch('feature/LoadAllModules'))
      .then(response => {
        next()
      })
  },
  computed: {
    ...mapState({ feature: 'feature' }),
    subscribedEntityId: function() {
      if (this.settingsType === 'portal') {
        return this.selectedCompany.CompanyGUID
      } else {
        return this.selectedGroupGuid
      }
    },
    portalId: function() {
      return this.selectedCompany.CompanyId
    },
    isSaveButtonDisabled: function() {
      return !this.settingsType || !this.feature.selectedModules
    },
    isSettingsDisabled: function() {
      return !this.selectedCompany
    }
  },
  created() {
    this.companies = this.feature.companies
  },
  methods: {
    onUserGroupSelect() {
      this.clearPreviousUserGroupSelection()
      store.dispatch('feature/getCompanyGroups', this.selectedCompany.CompanyId)
      if (this.selectedGroupGuid) {
        store.dispatch('feature/cleanModules')
        store
          .dispatch('feature/getSelectedModules', this.selectedGroupGuid)
          .then(() => {
            this.generateFeatureCheckboxes()
          })
      } else {
        store.dispatch('feature/cleanModules')
        this.submitEnabled = false
      }
    },
    onSelectedGroupChange() {
      this.currentFeatures = []
      store
        .dispatch('feature/getSelectedModules', this.selectedGroupGuid)
        .then(() => {
          this.generateFeatureCheckboxes()
          this.submitEnabled = true
        })
    },
    onPortalSelect() {
      store
        .dispatch(
          'feature/getSelectedModules',
          this.selectedCompany.CompanyGUID
        )
        .then(() => {
          this.generateFeatureCheckboxes()
        })
    },
    setSelectedCompany() {
      this.settingsType = null
      store.dispatch('feature/cleanModules')
      store.dispatch(
        'feature/selectedCompanyGuid',
        this.selectedCompany.CompanyGUID
      )
    },
    onSettingsTypeChange() {
      switch (this.settingsType) {
        case 'portal':
          this.currentFeatures = []
          this.onPortalSelect()
          this.submitEnabled = true
          break
        case 'group':
          this.onUserGroupSelect()
          break
        default:
          this.settingsType = null
          break
      }
    },

    generateFeatureCheckboxes() {
      const initialModules = this.feature.initialModules
      const currentFeatureNames = this.feature.selectedModules
        ? this.feature.selectedModules
        : []
      this.currentFeatures = initialModules.map(function(el) {
        el.selected = currentFeatureNames.includes(el.name)
        return el
      })
    },
    makeFeatureIdsArray() {
      this.featuresIds = this.currentFeatures
        .filter(e => e.selected === true)
        .map(el => el.id)
    },

    makeRequestObject() {
      return {
        subscribedEntityId: this.subscribedEntityId,
        moduleIds: this.featuresIds
      }
    },
    submitted() {
      this.isSubmited = true
      if (!this.featuresIds.length) {
        this.makeFeatureIdsArray()
      }
      store.dispatch('feature/selectedModules', this.featuresIds)
      store.dispatch('feature/submitForm', this.makeRequestObject())
    },

    reloadPage() {
      window.location.reload()
    },
    clearPreviousUserGroupSelection() {
      this.selectedGroupGuid = null
    }
  }
}
</script>

<style>
</style>
