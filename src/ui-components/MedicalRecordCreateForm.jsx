/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { MedicalRecord } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function MedicalRecordCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    livestockID: "",
    date: "",
    description: "",
    medicine: "",
  };
  const [livestockID, setLivestockID] = React.useState(
    initialValues.livestockID
  );
  const [date, setDate] = React.useState(initialValues.date);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [medicine, setMedicine] = React.useState(initialValues.medicine);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setLivestockID(initialValues.livestockID);
    setDate(initialValues.date);
    setDescription(initialValues.description);
    setMedicine(initialValues.medicine);
    setErrors({});
  };
  const validations = {
    livestockID: [{ type: "Required" }],
    date: [{ type: "Required" }],
    description: [{ type: "Required" }],
    medicine: [],
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
          livestockID,
          date,
          description,
          medicine,
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
          await DataStore.save(new MedicalRecord(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "MedicalRecordCreateForm")}
      {...rest}
    >
      <TextField
        label="Livestock id"
        isRequired={true}
        isReadOnly={false}
        value={livestockID}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              livestockID: value,
              date,
              description,
              medicine,
            };
            const result = onChange(modelFields);
            value = result?.livestockID ?? value;
          }
          if (errors.livestockID?.hasError) {
            runValidationTasks("livestockID", value);
          }
          setLivestockID(value);
        }}
        onBlur={() => runValidationTasks("livestockID", livestockID)}
        errorMessage={errors.livestockID?.errorMessage}
        hasError={errors.livestockID?.hasError}
        {...getOverrideProps(overrides, "livestockID")}
      ></TextField>
      <TextField
        label="Date"
        isRequired={true}
        isReadOnly={false}
        type="date"
        value={date}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              livestockID,
              date: value,
              description,
              medicine,
            };
            const result = onChange(modelFields);
            value = result?.date ?? value;
          }
          if (errors.date?.hasError) {
            runValidationTasks("date", value);
          }
          setDate(value);
        }}
        onBlur={() => runValidationTasks("date", date)}
        errorMessage={errors.date?.errorMessage}
        hasError={errors.date?.hasError}
        {...getOverrideProps(overrides, "date")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={true}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              livestockID,
              date,
              description: value,
              medicine,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Medicine"
        isRequired={false}
        isReadOnly={false}
        value={medicine}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              livestockID,
              date,
              description,
              medicine: value,
            };
            const result = onChange(modelFields);
            value = result?.medicine ?? value;
          }
          if (errors.medicine?.hasError) {
            runValidationTasks("medicine", value);
          }
          setMedicine(value);
        }}
        onBlur={() => runValidationTasks("medicine", medicine)}
        errorMessage={errors.medicine?.errorMessage}
        hasError={errors.medicine?.hasError}
        {...getOverrideProps(overrides, "medicine")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
