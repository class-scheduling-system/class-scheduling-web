import React from "react";
import { useFormData } from "./form_data_provider";
import { AdministrativeClassEntity } from "./types";

/**
 * 选课信息组件
 * 根据是否为选修课展示不同的表单内容
 */
export const EnrollmentInfoComponent: React.FC<{
  administrativeClasses: AdministrativeClassEntity[];
}> = ({ administrativeClasses }) => {
  const { formData, formErrors, setFormData } = useFormData();

  return (
    <div className="border border-base-300 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium mb-4">
        {formData.is_elective ? "选修课设置" : "必修课设置"}
      </h3>

      {formData.is_elective ? (
        // 选修课 - 显示学生人数输入
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">学生人数<span className="text-error">*</span></span>
          </label>
          <input
            type="number"
            name="student_count"
            min="1"
            placeholder="请输入学生人数"
            className={`input input-bordered w-full ${formErrors.student_count ? 'input-error' : ''}`}
            value={formData.student_count || ''}
            onChange={(e) => {
              setFormData({
                ...formData,
                student_count: parseInt(e.target.value) || undefined
              });
            }}
          />
          {formErrors.student_count && (
            <label className="label">
              <span className="label-text-alt text-error">{formErrors.student_count}</span>
            </label>
          )}
        </div>
      ) : (
        // 必修课 - 显示行政班级选择
        <div className="form-control">
          <label className="label">
            <span className="label-text">行政班级<span className="text-error">*</span></span>
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-base-300 rounded-lg min-h-[100px]">
            {administrativeClasses.map(cls => (
              <label
                key={cls.administrative_class_uuid}
                className={`flex items-center gap-1 p-2 border rounded-md cursor-pointer transition-colors ${formData.administrative_class_uuids.includes(cls.administrative_class_uuid)
                  ? 'bg-primary text-white'
                  : 'bg-base-200 hover:bg-base-300'
                  }`}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={formData.administrative_class_uuids.includes(cls.administrative_class_uuid)}
                  onChange={() => {
                    const current = [...formData.administrative_class_uuids];
                    const index = current.indexOf(cls.administrative_class_uuid);

                    if (index === -1) {
                      current.push(cls.administrative_class_uuid);
                    } else {
                      current.splice(index, 1);
                    }

                    setFormData({
                      ...formData,
                      administrative_class_uuids: current
                    });
                  }}
                />
                <span>{cls.class_name}</span>
              </label>
            ))}

            {administrativeClasses.length === 0 && (
              <div className="flex items-center justify-center w-full h-full text-base-content/60">
                无可用行政班级
              </div>
            )}
          </div>
          {formErrors.administrative_class_uuids && (
            <label className="label">
              <span className="label-text-alt text-error">{formErrors.administrative_class_uuids}</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}; 