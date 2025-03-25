import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { SiteInfoEntity } from "../../../models/entity/site_info_entity";
import { CardComponent } from "../../../components/card_component";
import { EditStudentAPI, GetStudentAPI } from "../../../apis/student_api";
import { message } from "antd";
import { StudentDTO } from "../../../models/dto/student_dto";
import { ArrowLeft, Save } from "@icon-park/react";

export function AcademicEditStudent({ site }: Readonly<{
    site: SiteInfoEntity
}>): JSX.Element {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);

    // 表单数据
    const [formData, setFormData] = useState<StudentDTO>({
        id: "",
        name: "",
        gender: false,
        clazz: ""
    });

    useEffect(() => {
        document.title = `编辑学生 | ${site.name ?? "Frontleaves Technology"}`;
        if (studentId) {
            fetchStudentData();
        }
    }, [site.name, studentId]);

    // 获取学生数据
    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await GetStudentAPI(studentId!);
            if (response?.output === "Success" && response.data) {
                setFormData({
                    id: response.data.id!,
                    name: response.data.name!,
                    gender: response.data.gender! === 0,
                    clazz: response.data.clazz!
                });
            } else {
                message.error(response?.error_message ?? "获取学生信息失败");
            }
        } catch (error) {
            console.error("获取学生信息失败", error);
            message.error("获取学生信息失败");
        } finally {
            setLoading(false);
        }
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await EditStudentAPI(studentId!, formData);
            if (response?.output === "Success") {
                message.success("更新成功");
                navigate("/academic/student");
            } else {
                message.error(response?.error_message ?? "更新失败");
            }
        } catch (error) {
            console.error("更新学生失败", error);
            message.error("更新失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardComponent>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary-content">编辑学生</h2>
                    <button
                        onClick={() => navigate("/academic/student")}
                        className="btn btn-ghost btn-sm gap-2"
                    >
                        <ArrowLeft theme="outline" size="18"/>
                        返回
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">学号</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                required
                                placeholder="请输入学号"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">姓名</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="请输入姓名"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">性别</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.gender.toString()}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value === "true" })}
                                required
                            >
                                <option value="false">男</option>
                                <option value="true">女</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">班级</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={formData.clazz}
                                onChange={(e) => setFormData({ ...formData, clazz: e.target.value })}
                                required
                                placeholder="请输入班级"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary gap-2"
                            disabled={loading}
                        >
                            <Save theme="outline" size="18"/>
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </CardComponent>
    );
} 