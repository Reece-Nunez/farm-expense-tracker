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
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createProduct } from "../graphql/mutations";
const client = generateClient();
export default function ProductCreateForm(props) {
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
    sub: "",
    name: "",
    description: "",
    category: "",
    unitPrice: "",
    unit: "",
    sku: "",
    barcode: "",
    stockQuantity: "",
    minStockLevel: "",
    isActive: false,
    createdAt: "",
    updatedAt: "",
  };
  const [sub, setSub] = React.useState(initialValues.sub);
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [category, setCategory] = React.useState(initialValues.category);
  const [unitPrice, setUnitPrice] = React.useState(initialValues.unitPrice);
  const [unit, setUnit] = React.useState(initialValues.unit);
  const [sku, setSku] = React.useState(initialValues.sku);
  const [barcode, setBarcode] = React.useState(initialValues.barcode);
  const [stockQuantity, setStockQuantity] = React.useState(
    initialValues.stockQuantity
  );
  const [minStockLevel, setMinStockLevel] = React.useState(
    initialValues.minStockLevel
  );
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setSub(initialValues.sub);
    setName(initialValues.name);
    setDescription(initialValues.description);
    setCategory(initialValues.category);
    setUnitPrice(initialValues.unitPrice);
    setUnit(initialValues.unit);
    setSku(initialValues.sku);
    setBarcode(initialValues.barcode);
    setStockQuantity(initialValues.stockQuantity);
    setMinStockLevel(initialValues.minStockLevel);
    setIsActive(initialValues.isActive);
    setCreatedAt(initialValues.createdAt);
    setUpdatedAt(initialValues.updatedAt);
    setErrors({});
  };
  const validations = {
    sub: [{ type: "Required" }],
    name: [{ type: "Required" }],
    description: [],
    category: [{ type: "Required" }],
    unitPrice: [{ type: "Required" }],
    unit: [{ type: "Required" }],
    sku: [],
    barcode: [],
    stockQuantity: [],
    minStockLevel: [],
    isActive: [{ type: "Required" }],
    createdAt: [],
    updatedAt: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          name,
          description,
          category,
          unitPrice,
          unit,
          sku,
          barcode,
          stockQuantity,
          minStockLevel,
          isActive,
          createdAt,
          updatedAt,
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
          await client.graphql({
            query: createProduct.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ProductCreateForm")}
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
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
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
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name: value,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description: value,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
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
        label="Category"
        isRequired={true}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category: value,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.category ?? value;
          }
          if (errors.category?.hasError) {
            runValidationTasks("category", value);
          }
          setCategory(value);
        }}
        onBlur={() => runValidationTasks("category", category)}
        errorMessage={errors.category?.errorMessage}
        hasError={errors.category?.hasError}
        {...getOverrideProps(overrides, "category")}
      ></TextField>
      <TextField
        label="Unit price"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={unitPrice}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice: value,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.unitPrice ?? value;
          }
          if (errors.unitPrice?.hasError) {
            runValidationTasks("unitPrice", value);
          }
          setUnitPrice(value);
        }}
        onBlur={() => runValidationTasks("unitPrice", unitPrice)}
        errorMessage={errors.unitPrice?.errorMessage}
        hasError={errors.unitPrice?.hasError}
        {...getOverrideProps(overrides, "unitPrice")}
      ></TextField>
      <TextField
        label="Unit"
        isRequired={true}
        isReadOnly={false}
        value={unit}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit: value,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.unit ?? value;
          }
          if (errors.unit?.hasError) {
            runValidationTasks("unit", value);
          }
          setUnit(value);
        }}
        onBlur={() => runValidationTasks("unit", unit)}
        errorMessage={errors.unit?.errorMessage}
        hasError={errors.unit?.hasError}
        {...getOverrideProps(overrides, "unit")}
      ></TextField>
      <TextField
        label="Sku"
        isRequired={false}
        isReadOnly={false}
        value={sku}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku: value,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.sku ?? value;
          }
          if (errors.sku?.hasError) {
            runValidationTasks("sku", value);
          }
          setSku(value);
        }}
        onBlur={() => runValidationTasks("sku", sku)}
        errorMessage={errors.sku?.errorMessage}
        hasError={errors.sku?.hasError}
        {...getOverrideProps(overrides, "sku")}
      ></TextField>
      <TextField
        label="Barcode"
        isRequired={false}
        isReadOnly={false}
        value={barcode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode: value,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.barcode ?? value;
          }
          if (errors.barcode?.hasError) {
            runValidationTasks("barcode", value);
          }
          setBarcode(value);
        }}
        onBlur={() => runValidationTasks("barcode", barcode)}
        errorMessage={errors.barcode?.errorMessage}
        hasError={errors.barcode?.hasError}
        {...getOverrideProps(overrides, "barcode")}
      ></TextField>
      <TextField
        label="Stock quantity"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={stockQuantity}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity: value,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.stockQuantity ?? value;
          }
          if (errors.stockQuantity?.hasError) {
            runValidationTasks("stockQuantity", value);
          }
          setStockQuantity(value);
        }}
        onBlur={() => runValidationTasks("stockQuantity", stockQuantity)}
        errorMessage={errors.stockQuantity?.errorMessage}
        hasError={errors.stockQuantity?.hasError}
        {...getOverrideProps(overrides, "stockQuantity")}
      ></TextField>
      <TextField
        label="Min stock level"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={minStockLevel}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel: value,
              isActive,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.minStockLevel ?? value;
          }
          if (errors.minStockLevel?.hasError) {
            runValidationTasks("minStockLevel", value);
          }
          setMinStockLevel(value);
        }}
        onBlur={() => runValidationTasks("minStockLevel", minStockLevel)}
        errorMessage={errors.minStockLevel?.errorMessage}
        hasError={errors.minStockLevel?.hasError}
        {...getOverrideProps(overrides, "minStockLevel")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
      ></SwitchField>
      <TextField
        label="Created at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt: value,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              sub,
              name,
              description,
              category,
              unitPrice,
              unit,
              sku,
              barcode,
              stockQuantity,
              minStockLevel,
              isActive,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
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
