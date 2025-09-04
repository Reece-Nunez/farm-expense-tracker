/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type FarmCreateFormInputValues = {
    ownerSub?: string;
    name?: string;
    farmType?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    acres?: number;
    establishedYear?: number;
    website?: string;
    businessRegistration?: string;
    taxId?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
export declare type FarmCreateFormValidationValues = {
    ownerSub?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    farmType?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    zipCode?: ValidationFunction<string>;
    country?: ValidationFunction<string>;
    acres?: ValidationFunction<number>;
    establishedYear?: ValidationFunction<number>;
    website?: ValidationFunction<string>;
    businessRegistration?: ValidationFunction<string>;
    taxId?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FarmCreateFormOverridesProps = {
    FarmCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    ownerSub?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    farmType?: PrimitiveOverrideProps<SelectFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    state?: PrimitiveOverrideProps<TextFieldProps>;
    zipCode?: PrimitiveOverrideProps<TextFieldProps>;
    country?: PrimitiveOverrideProps<TextFieldProps>;
    acres?: PrimitiveOverrideProps<TextFieldProps>;
    establishedYear?: PrimitiveOverrideProps<TextFieldProps>;
    website?: PrimitiveOverrideProps<TextFieldProps>;
    businessRegistration?: PrimitiveOverrideProps<TextFieldProps>;
    taxId?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FarmCreateFormProps = React.PropsWithChildren<{
    overrides?: FarmCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FarmCreateFormInputValues) => FarmCreateFormInputValues;
    onSuccess?: (fields: FarmCreateFormInputValues) => void;
    onError?: (fields: FarmCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FarmCreateFormInputValues) => FarmCreateFormInputValues;
    onValidate?: FarmCreateFormValidationValues;
} & React.CSSProperties>;
export default function FarmCreateForm(props: FarmCreateFormProps): React.ReactElement;
