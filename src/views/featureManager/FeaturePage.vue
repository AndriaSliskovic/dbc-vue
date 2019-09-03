<template>
  <v-app id="inspire">
    <div>
      <NotificationContainer />
      <h3>Feature manager</h3>
      <v-col>
        <form>
          <v-flex xs12 sm6 d-flex data-app>
            <v-select
              :items="feature.companies.SiteCustomersList"
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
          </v-flex>
        </form>
      </v-col>
      <v-col>
        <!-- Select options -->
        <v-flex xs12 sm6 d-flex data-app>
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
        </v-flex>
      </v-col>

      <div>
        <div v-if="selectedCompany">
          <v-col>
            <!-- Ako je selektovan poratal -->
            <div v-if="settingsType==='portal'">
              <FeatureDetail :currentFeatures="currentFeatures" @updateModules="featuresIds=$event"></FeatureDetail>
            </div>
            <!-- Ako je selektovana grupa -->
            <div v-if="settingsType==='group'">
              <form>
                <v-flex xs12 sm6 d-flex data-app>
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
                </v-flex>
                <FeatureDetail :currentFeatures="currentFeatures" @updateModules="featuresIds=$event"></FeatureDetail>
              </form>
            </div>
          </v-col>

          <!-- SUBMIT BUTTON -->
          <v-row justify="center">
            <v-btn color="error" @click.prevent="submitted" :disabled="isSaveButtonDisabled">Save</v-btn>
          </v-row>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import NProgress from 'nprogress'
import EventService from '../../services/EventService'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import FeatureDetail from './FeatureDetail'
import NotificationContainer from '../../components/NotificationContainer'

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
      selectOptions: [
        {
          key: 'portal',
          name: 'Portal'
        },
        {
          key: 'group',
          name: 'User Group'
        }
      ]
    }
  },
  components: {
    FeatureDetail,
    NotificationContainer
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store
      .dispatch('feature/loadPortals')
      .then(store.dispatch('feature/LoadAllModules'))
      .then(response => {
        next() // Only once this is called does the navigation continue
      })
  },
  computed: {
    ...mapState({ feature: 'feature' }),
    subscribedEntityId: function() {
      if (this.settingsType === 'portal') {
        return this.selectedCompany.CompanyGuid
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
    },
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
        store.dispatch('feature/cleanModules').then(() => {
          this.generateFeatureCheckboxes()
        })
      }
    },
    onPortalSelect() {
      store
        .dispatch(
          'feature/getSelectedModules',
          this.selectedCompany.CompanyGuid
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
        this.selectedCompany.CompanyGuid
      )
    },
    onSettingsTypeChange() {
      switch (this.settingsType) {
        case 'portal':
          this.onPortalSelect()
          break
        case 'group':
          this.onUserGroupSelect()
          break
        default:
          this.settingsType = null
          break
      }
    },
    onSelectedGroupChange() {
      store
        .dispatch('feature/getSelectedModules', this.selectedGroupGuid)
        .then(() => {
          this.generateFeatureCheckboxes()
        })
    },
    generateFeatureCheckboxes() {
      const initialModules = this.feature.initialModules
      const currentFeatureNames = this.feature.selectedModules ? this.feature.selectedModules : []
      
      this.currentFeatures = initialModules.map(function(el) {
          el.selected = currentFeatureNames.includes(el.name) //dodaje se novo svojstvo na osnovu kog ce checkbox biti selektovan.
          return el
        })
    },

    makeRequestObject() {
      return {
        subscribedEntityId: this.subscribedEntityId,
        moduleIds: this.featuresIds
      }
    },
    submitted() {
      this.isSubmited = true
      store.dispatch('feature/selectedModules', this.featuresIds)
      store.dispatch('feature/submitForm', this.makeRequestObject())
    },
    reloadPage() {
      window.location.reload()
    },
    clearPreviousUserGroupSelection() {
      this.selectedGroupGuid=null
    }
  }
}
</script>

<style>
</style>
