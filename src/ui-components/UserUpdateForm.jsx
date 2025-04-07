/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { User } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function UserUpdateForm(props) {
  const {
    id: idProp,
    user: userModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    sub: "",
    username: "",
    email: "",
    farmName: "",
    phone: "",
    aboutMe: "",
    profilePictureKey: "",
    role: "",
    preferences: "",
  };
  const [sub, setSub] = React.useState(initialValues.sub);
  const [username, setUsername] = React.useState(initialValues.username);
  const [email, setEmail] = React.useState(initialValues.email);
  const [farmName, setFarmName] = React.useState(initialValues.farmName);
  const [phone, setPhone] = React.useState(initialValues.phone);
  const [aboutMe, setAboutMe] = React.useState(initialValues.aboutMe);
  const [profilePictureKey, setProfilePictureKey] = React.useState(
    initialValues.profilePictureKey
  );
  const [role, setRole] = React.useState(initialValues.role);
  const [preferences, setPreferences] = React.useState(
    initialValues.preferences
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userRecord
      ? { ...initialValues, ...userRecord }
      : initialValues;
    setSub(cleanValues.sub);
    setUsername(cleanValues.username);
    setEmail(cleanValues.email);
    setFarmName(cleanValues.farmName);
    setPhone(cleanValues.phone);
    setAboutMe(cleanValues.aboutMe);
    setProfilePictureKey(cleanValues.profilePictureKey);
    setRole(cleanValues.role);
    setPreferences(
      typeof cleanValues.preferences === "string" ||
        cleanValues.preferences === null
        ? cleanValues.preferences
        : JSON.stringify(cleanValues.preferences)
    );
    setErrors({});
  };
  const [userRecord, setUserRecord] = React.useState(userModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(User, idProp)
        : userModelProp;
      setUserRecord(record);
    };
    queryData();
  }, [idProp, userModelProp]);
  React.useEffect(resetStateValues, [userRecord]);
  const validations = {
    sub: [{ type: "Required" }],
    username: [{ type: "Required" }],
    email: [],
    farmName: [],
    phone: [],
    aboutMe: [],
    profilePictureKey: [],
    role: [],
    preferences: [{ type: "JSON" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          sub,
          username,
          email,
          farmName,
          phone,
          aboutMe,
          profilePictureKey,
          role,
          preferences,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(
            User.copyOf(userRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserUpdateForm")}
      {...rest}
    >
      <TextField
        label="Sub"
        isRequired={true}
        isReadOnly={false}
        value={sub}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub: value,
              username,
              email,
              farmName,
              phone,
              aboutMe,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.sub ?? value;
          }
          if (errors.sub?.hasError) {
            runValidationTasks("sub", value);
          }
          setSub(value);
        }}
        onBlur={() => runValidationTasks("sub", sub)}
        errorMessage={errors.sub?.errorMessage}
        hasError={errors.sub?.hasError}
        {...getOverrideProps(overrides, "sub")}
      ></TextField>
      <TextField
        label="Username"
        isRequired={true}
        isReadOnly={false}
        value={username}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username: value,
              email,
              farmName,
              phone,
              aboutMe,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.username ?? value;
          }
          if (errors.username?.hasError) {
            runValidationTasks("username", value);
          }
          setUsername(value);
        }}
        onBlur={() => runValidationTasks("username", username)}
        errorMessage={errors.username?.errorMessage}
        hasError={errors.username?.hasError}
        {...getOverrideProps(overrides, "username")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={false}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email: value,
              farmName,
              phone,
              aboutMe,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Farm name"
        isRequired={false}
        isReadOnly={false}
        value={farmName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName: value,
              phone,
              aboutMe,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.farmName ?? value;
          }
          if (errors.farmName?.hasError) {
            runValidationTasks("farmName", value);
          }
          setFarmName(value);
        }}
        onBlur={() => runValidationTasks("farmName", farmName)}
        errorMessage={errors.farmName?.errorMessage}
        hasError={errors.farmName?.hasError}
        {...getOverrideProps(overrides, "farmName")}
      ></TextField>
      <TextField
        label="Phone"
        isRequired={false}
        isReadOnly={false}
        value={phone}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName,
              phone: value,
              aboutMe,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.phone ?? value;
          }
          if (errors.phone?.hasError) {
            runValidationTasks("phone", value);
          }
          setPhone(value);
        }}
        onBlur={() => runValidationTasks("phone", phone)}
        errorMessage={errors.phone?.errorMessage}
        hasError={errors.phone?.hasError}
        {...getOverrideProps(overrides, "phone")}
      ></TextField>
      <TextField
        label="About me"
        isRequired={false}
        isReadOnly={false}
        value={aboutMe}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName,
              phone,
              aboutMe: value,
              profilePictureKey,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.aboutMe ?? value;
          }
          if (errors.aboutMe?.hasError) {
            runValidationTasks("aboutMe", value);
          }
          setAboutMe(value);
        }}
        onBlur={() => runValidationTasks("aboutMe", aboutMe)}
        errorMessage={errors.aboutMe?.errorMessage}
        hasError={errors.aboutMe?.hasError}
        {...getOverrideProps(overrides, "aboutMe")}
      ></TextField>
      <TextField
        label="Profile picture key"
        isRequired={false}
        isReadOnly={false}
        value={profilePictureKey}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName,
              phone,
              aboutMe,
              profilePictureKey: value,
              role,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.profilePictureKey ?? value;
          }
          if (errors.profilePictureKey?.hasError) {
            runValidationTasks("profilePictureKey", value);
          }
          setProfilePictureKey(value);
        }}
        onBlur={() =>
          runValidationTasks("profilePictureKey", profilePictureKey)
        }
        errorMessage={errors.profilePictureKey?.errorMessage}
        hasError={errors.profilePictureKey?.hasError}
        {...getOverrideProps(overrides, "profilePictureKey")}
      ></TextField>
      <TextField
        label="Role"
        isRequired={false}
        isReadOnly={false}
        value={role}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName,
              phone,
              aboutMe,
              profilePictureKey,
              role: value,
              preferences,
            };
            const result = onChange(modelFields);
            value = result?.role ?? value;
          }
          if (errors.role?.hasError) {
            runValidationTasks("role", value);
          }
          setRole(value);
        }}
        onBlur={() => runValidationTasks("role", role)}
        errorMessage={errors.role?.errorMessage}
        hasError={errors.role?.hasError}
        {...getOverrideProps(overrides, "role")}
      ></TextField>
      <TextAreaField
        label="Preferences"
        isRequired={false}
        isReadOnly={false}
        value={preferences}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              username,
              email,
              farmName,
              phone,
              aboutMe,
              profilePictureKey,
              role,
              preferences: value,
            };
            const result = onChange(modelFields);
            value = result?.preferences ?? value;
          }
          if (errors.preferences?.hasError) {
            runValidationTasks("preferences", value);
          }
          setPreferences(value);
        }}
        onBlur={() => runValidationTasks("preferences", preferences)}
        errorMessage={errors.preferences?.errorMessage}
        hasError={errors.preferences?.hasError}
        {...getOverrideProps(overrides, "preferences")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || userModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || userModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
