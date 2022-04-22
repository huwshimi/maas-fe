import { useEffect, useRef } from "react";

import { Link } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import type { UsabillaLive } from "@maas-ui/maas-ui-shared";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useSendAnalytics } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

declare global {
  interface Window {
    usabilla_live: UsabillaLive;
  }
}

const GeneralSchema = Yup.object().shape({
  maas_name: Yup.string().required(),
  enable_analytics: Yup.boolean(),
  release_notifications: Yup.boolean(),
});

type GeneralFormValues = {
  maas_name: string;
  enable_analytics: boolean;
  release_notifications: boolean;
};

const GeneralForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const maasName = useSelector(configSelectors.maasName);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const releaseNotifications = useSelector(
    configSelectors.releaseNotifications
  );
  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);
  const previousReleaseNotifications = useRef(releaseNotifications);
  const previousEnableAnalytics = usePrevious(analyticsEnabled);

  useEffect(() => {
    if (analyticsEnabled !== previousEnableAnalytics) {
      // If the analytics setting has been changed, the only way to be
      // completely sure the events are cleared is to reload the window.
      // This needs to be done once the data has been been updated successfully,
      // hence doing the refresh in this useEffect.
      window.location.reload();
    }
  }, [analyticsEnabled, previousEnableAnalytics]);

  const sendAnalytics = useSendAnalytics();

  return (
    <Formik
      initialValues={{
        maas_name: maasName || "",
        enable_analytics: analyticsEnabled || false,
        release_notifications: releaseNotifications || false,
      }}
      onSubmit={(values, { resetForm }) => {
        if (values.enable_analytics !== previousEnableAnalytics) {
          // Only send the analytics event if the value changes.
          sendAnalytics(
            "General configuration settings",
            values.enable_analytics ? "Turned on" : "Turned off",
            "Enable Google Analytics"
          );
        }
        // Show the Usabilla form if the notifications have been turned off and
        // analytics has been enabled and Usabilla as been instantiated.
        if (
          !values.release_notifications &&
          previousReleaseNotifications.current &&
          values.enable_analytics &&
          window.usabilla_live
        ) {
          window.usabilla_live("trigger", "release_notifications_off");
        }
        previousReleaseNotifications.current = values.release_notifications;
        dispatch(configActions.update(values));
        resetForm({ values });
      }}
      validationSchema={GeneralSchema}
    >
      <FormikFormContent<GeneralFormValues>
        buttonsAlign="left"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Saved",
          category: "Configuration settings",
          label: "General form",
        }}
        saving={saving}
        saved={saved}
      >
        <FormikField
          label="MAAS name"
          type="text"
          name="maas_name"
          required={true}
          wrapperClassName="u-sv2"
        />
        <h5>Data analytics</h5>
        <FormikField
          label="Enable analytics to shape improvements to user experience"
          type="checkbox"
          name="enable_analytics"
          help={
            <>
              The analytics used in MAAS are Google Analytics, Usabilla and
              Sentry Error Tracking.{" "}
              <Link
                href="https://ubuntu.com/legal/data-privacy"
                rel="noreferrer noopener"
                target="_blank"
              >
                Data privacy
              </Link>
            </>
          }
          wrapperClassName="u-sv3"
        />
        <h5>Notifications</h5>
        <FormikField
          label="Enable new release notifications"
          type="checkbox"
          name="release_notifications"
          help="This applies to all users of MAAS. "
          wrapperClassName="u-sv3"
        />
      </FormikFormContent>
    </Formik>
  );
};

export default GeneralForm;
